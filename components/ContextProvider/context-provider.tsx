"use client";
import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import useToast from "@/hooks/Toast/useToast";
import { useSearchParams } from "next/navigation";

export const Context = createContext<any>({});

const ContextProvider = ({ children }: any) => {
  const session = useSession();
  const { status, data } = session;
  const [context, setContext] = useState();

  /** updateContext
   * @info To refresh the context, call updateContext(!update)
   */
  const [update, updateContext] = useState(false);
  const toast = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async function getContextOnce() {
      try {
        if (status === "authenticated") {
          console.log("AUTH DATA", JSON.stringify(data, null, 2));
          let state: {
            user: User;
            currentLocation: String;
            companyId?: String;
          } = data as any;

          let isAuthenticated = true;
          // * Donald's Notes: You should check to see if the location ID comes from the
          // SSO Object first. You may not need to pass the `currentLocation` over the
          // token if you can get the location to persist during the session.

          if (window.self === window.top) {
            const currentLocation = searchParams.get("currentLocation");
            const companyId = searchParams.get("companyId");
            if (currentLocation && companyId) {
              state.currentLocation = currentLocation;
              state.companyId = companyId;
            }
          } else {
            const timeoutId1 = setTimeout(() => {
              if (!key)
                toast({
                  message: "Unable to retrieve context.",
                  status: "error"
                });
            }, 20000);

            const timeoutId2 = setTimeout(() => {
              if (!key)
                window.open(
                  process.env.NODE_ENV === "production"
                    ? "https://www.healthproai.com"
                    : "http://localhost:3000",
                  "_self"
                );
            }, 25000);

            const key = (await new Promise((resolve) => {
              window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
              window.addEventListener("message", (args) => {
                let { data } = args;
                console.log("window.message", args);
                if (data.message === "REQUEST_USER_DATA_RESPONSE") {
                  // console.log("USER_DATA_RESPONSE", data.payload);
                  resolve(data.payload);
                }
              });
            })) as string;

            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);

            await fetch("/api/lead-connector", {
              method: "POST",
              body: JSON.stringify({
                key
              }),
              headers: { "Content-Type": "application/json" }
            })
              .then((res) => res.json())
              .then(async (response) => {
                const { success, ssoObject, redirectUrl, tokenUrl, message } =
                  response;
                if (!success) throw new Error(message);
                console.log(
                  "API LEADCONNECTOR RES",
                  JSON.stringify(response, null, 2)
                );
                state.currentLocation = ssoObject.activeLocation;
                state.companyId = ssoObject.companyId;
                if (ssoObject.email !== data?.user?.email) {
                  toast({
                    message: "SSO/Cookie mismatch.",
                    status: "warning"
                  });
                  await signOut({ redirect: false });
                  // setTimeout(async () => {
                  window.open(
                    `${
                      process.env.NODE_ENV === "production"
                        ? "https://login.healthproai.com"
                        : "http://localhost:3001"
                    }/auth/login?key=${encodeURIComponent(key)}`,
                    "_self"
                  );
                  // }, 3000);
                  isAuthenticated = false;
                }
              })
              .catch((error) => {
                console.error(
                  "Error getting CRM Auth Token.",
                  error.message,
                  error
                );
                toast({
                  message:
                    "Error getting CRM Auth Token. Please check the console.",
                  status: "error"
                });
              });
          }

          fetch("/api/logger", {
            method: "POST",
            body: JSON.stringify({ message: "STATE", state }),
            headers: { "Content-Type": "application/json" }
          })
            .then((res) => res.json())
            .then(({ success }) => {
              if (!success) console.error("/api/logger threw error");
            });

          if (isAuthenticated) {
            fetch("/api/context", {
              method: "POST",
              body: JSON.stringify(state),
              headers: { "Content-Type": "application/json" }
            })
              .then((res) => res.json())
              .then(({ success, context, message }) => {
                if (!success) throw new Error(message);
                console.log("CONTEXT", context);
                toast({ message: "Success" });
                setContext(context);
              })
              .catch((error) => {
                console.error("CONTEXT ERROR", error);
                toast({
                  message: error.message + " Redirecting...",
                  status: "error"
                });
                setTimeout(() => {
                  signOut();
                }, 5000);
              });
          }
        }
      } catch (error) {
        console.log("T/C CONTEXT ERROR", error);
        signOut();
        throw error;
      }
    })();
    return () => {};
  }, [status, update]);

  return (
    <Context.Provider value={{ context, setContext, update, updateContext }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
