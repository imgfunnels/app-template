import { ObjectId } from "bson";

export async function getLocation(locationId: string, secret: string) {
  console.log("getLocation", locationId);
  let token = await fetch(
    "https://us-east-1.aws.data.mongodb-api.com/app/data-dfujg/endpoint/data/v1/action/findOne",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/ejson",
        "Access-Control-Request-Headers": "*",
        "api-key": secret as string
      },
      body: JSON.stringify({
        collection: "Location",
        database: "tristarpt",
        dataSource: "Cluster0",
        filter: { _id: { $oid: new ObjectId(locationId) } }
      })
    }
  )
    .then((response) => response.json())
    .then(function (response: any) {
      console.log("getLocation RES", response);
      return response.document;
    })
    .catch(function (error) {
      console.log(error);
    });

  return token;
}

export async function getToken(locationId: string, secret: string) {
  console.log("getToken", locationId);
  let token = await fetch(
    "https://us-east-1.aws.data.mongodb-api.com/app/data-dfujg/endpoint/data/v1/action/findOne",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": secret as string
      },
      body: JSON.stringify({
        collection: "refresh_tokens",
        database: "healthproai",
        dataSource: "Cluster0",
        filter: { locationId }
      })
    }
  )
    .then((response) => response.json())
    .then(function (response: any) {
      // console.log("getToken RES", response);
      return response.document;
    })
    .catch(function (error) {
      console.log(error);
    });

  return token;
}

export async function deleteToken(locationId: string, secret?: string) {
  console.log("getToken", locationId);
  let token = await fetch(
    "https://us-east-1.aws.data.mongodb-api.com/app/data-dfujg/endpoint/data/v1/action/deleteOne",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": secret as string
      },
      body: JSON.stringify({
        collection: "refresh_tokens",
        database: "healthproai",
        dataSource: "Cluster0",
        filter: { locationId }
      })
    }
  )
    .then((response) => response.json())
    .then(function (response) {
      console.log("DELETED TOKEN?", response);
      return response.document;
    })
    .catch(function (error) {
      console.log(error);
    });

  return token;
}
