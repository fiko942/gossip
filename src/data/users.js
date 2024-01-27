import moment from "moment-timezone";

const names = [
  "wiji fiko teren",
  "fiko942",
  "difan",
  "intan veni vidi vici",
  "tantri",
  "putri",
  "fitri cahya",
  "dwi yuliawati",
  "ria devita meidy",
  "winda",
];
const count = 30;
let users = [];
for (let i = 0; i < count; i++) {
  const avatarNumber = Math.floor(Math.random() * 69) + 1;
  users.push({
    id: `user-${i}`,
    name: names[Math.floor(Math.random() * names.length)],
    avatar: `https://randomuser.me/api/portraits/women/${avatarNumber}.jpg`,
    isVerified: false,
    lastChatUTCEpoch: moment().unix(),
  });
}

export default users;
