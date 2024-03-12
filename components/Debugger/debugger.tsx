"use client";
import { Button, Portal } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { v4 } from "uuid";
import { Context } from "../ContextProvider/context-provider";

const Debugger = (props: any) => {
  const { context, setContext } = useContext(Context);
  const session = useSession();

  const { status, data, update } = session;
  let { values, touched, errors, contact, fileUploadFields } = props;

  props = { session, ...props };

  const [toggleVisor, setToggleVisor] = useState(false);
  return (
    <>
      {process.env.NODE_ENV === "development" ? (
        <Portal>
          <div
            className={`print:hidden fixed z-[1410] inset-0 h-screen w-screen ${
              toggleVisor ? "top-0" : "top-[100vh]"
            } bg-[#000000cc] transition-transform`}
          >
            <div className="w-full flex justify-center z-20 absolute">
              <Button
                colorScheme="blackAlpha"
                className={`fixed !rounded-none ${
                  toggleVisor ? "!top-0 !rounded-b" : "!-top-10 !rounded-t"
                } !text-lime-400`}
                onClick={() => setToggleVisor(!toggleVisor)}
              >
                <pre>
                  <span className="tracking-widest">DEBUGGER</span> {"</>"}
                </pre>
              </Button>
            </div>
            <div className="overflow-y-auto max-h-screen pb-10 text-slate-50">
              <div className="container mx-auto h-max my-20 grid grid-cols-1 md:grid-cols-4 group">
                {Object.keys(props).map((key) => {
                  let sanitized;
                  if (key === "fileUploadFields") {
                    let cardinal = 0;
                    let arr = [];
                    for (let field of props[key]) {
                      arr.push({
                        ...field,
                        ref: field.ref ? typeof field.ref : undefined, // Circular Reference
                        wrapper: field.wrapper
                          ? typeof field.wrapper
                          : undefined // Circular Reference
                      } as any);
                      cardinal++;
                    }
                    sanitized = arr;
                    // console.log(
                    //   `OBJECT "${key}" SANITIZED FOR DEBUGGER`,
                    //   props[key]
                    // );
                  } else {
                    sanitized = props[key];
                  }

                  return (
                    <div
                      key={v4()}
                      className="group-hover:opacity-10 hover:!opacity-100"
                    >
                      <pre className="max-w-full overflow-clip hover:overflow-visible hover:bg-zinc-800 px-4 py-2">
                        <span className="text-indigo-400">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                        </span>
                        {JSON.stringify(sanitized, null, 2)}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Portal>
      ) : (
        <></>
      )}
    </>
  );
};

export default Debugger;
