import { set, get, setMany, getMany, del } from "idb-keyval";

export const setData = async (key, value) => {
  let response = false;
  await set(key, value)
    .then(() => {
      console.log("It works!");
      response = true;
    })
    .catch((err) => {
      console.log("It failed!", err);
      response = false;
    });
  return response;
};

export const getData = async (key) => {
  let value = null;
  await get(key)
    .then((val) => {
      console.log("It works!");
      value = val;
    })
    .catch((err) => {
      console.log("It failed!", err);
      value = null;
    });
  return value;
};

//arrayKeyValue must be
/*[
    [key1, value1],
    [key2, value2],
  ]*/
export const setMultiData = async (arrayKeyValue) => {
  let response = false;
  await setMany(arrayKeyValue)
    .then(() => {
      console.log("It works!");
      response = true;
    })
    .catch((err) => {
      console.log("It failed!", err);
      response = false;
    });
  return response;
};
//arrayKey must be
/*
[key1, key2]
*/
export const getMultiData = async (arrayKey) => {
  let value = null;
  await getMany(arrayKey)
    .then((val) => {
      console.log("It works!");
      value = val;
    })
    .catch((err) => {
      console.log("It failed!", err);
      value = null;
    });
  return value;
};

//delete
export const deleteData = async (key) => {
  let response = false;
  await del(key)
    .then((val) => {
      console.log("It works!");
      response = true;
    })
    .catch((err) => {
      console.log("It failed!", err);
      response = false;
    });
  return response;
};
