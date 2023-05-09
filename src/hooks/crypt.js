import CryptoJS from "crypto-js";
export default (method, data) => {
  if (method == true) {
    if (data == undefined || data == null || data == "") {
      return null;
    } else {
      return CryptoJS.AES.encrypt(JSON.stringify(data), "CokGizliSifre").toString();
    }
  } else {
    var bytes = CryptoJS.AES.decrypt(data, "CokGizliSifre");
    if (data == undefined || data == null || data == "") {
      return null;
    } else {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  }
};
