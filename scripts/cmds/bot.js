const axios = require("axios");

module.exports = {
  config: {
    name: "Leo",
    version: "1.4.1",
    author: "Leo MorshEd",
    countDown: 0,
    role: 0,
    aliases: ["jaan", "janu", "bby, Morshed, Bot"],
    shortDescription: "leo AI চ্যাটবট",
    longDescription: "MorshEd AI Bot — প্রশ্নের উত্তর দেয়, কথা বলে এবং মজার রিপ্লাই করে।",
    category: "jan",
    guide: `{pn} <message>
{pn} teach <প্রশ্ন> - <উত্তর>
{pn} count`
  },

  // ===== Fetch total Q&A count from server =====
  async fetchCount() {
    try {
      const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/count`);
      return res.data;
    } catch (e) {
      console.error("fetchCount error:", e.message);
      return { questions: 0, answers: 0 };
    }
  },

  // ===== Get answer from server =====
  async getAnswer(question) {
    try {
      const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/answer/${encodeURIComponent(question)}`);
      return res.data.answer || "❌ আমি এখনো এটা শিখিনি, দয়া করে আমাকে শেখান! 👀";
    } catch (e) {
      console.error("getAnswer error:", e.message);
      return "❌ সার্ভার থেকে উত্তর পাওয়া যায়নি, পরে আবার চেষ্টা করুন!";
    }
  },

  // ===== Teach multiple questions at once =====
  async teachMultiple(qaText) {
    try {
      const res = await axios.post(`https://jan-api-by-aminul-sordar.vercel.app/teach`, { text: qaText });
      return res.data.message;
    } catch (e) {
      console.error("teachMultiple error:", e.message);
      return "❌ শেখানো ব্যর্থ হয়েছে! সার্ভার সমস্যা হতে পারে।";
    }
  },

  // ===== Handle reply from user =====
  onReply: async function ({ api, event }) {
    const reply = event.body.trim();
    const responseMessage = await this.getAnswer(reply);

    await api.sendMessage(responseMessage, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID
        });
      }
    }, event.messageID);
  },

  // ===== Main command entry point =====
  onStart: async function ({ api, args, event }) {
    if (args.length < 1) {
      return api.sendMessage("❌ দয়া করে একটি প্রশ্ন করুন!", event.threadID, event.messageID);
    }

    const command = args[0].toLowerCase();

    // Handle count request
    if (command === "count") {
      const count = await this.fetchCount();
      return api.sendMessage(
        `📊 জ্ঞানভাণ্ডার:\n\n` +
        `📌 মোট প্রশ্ন: ${count.questions}\n` +
        `📌 মোট উত্তর: ${count.answers}\n\n` +
        `💡 আমাকে আরও শেখানোর মাধ্যমে আমাকে আরও স্মার্ট বানান!\n` +
        `🔍 কিছু প্রশ্ন করুন, আমি চেষ্টা করব উত্তর দেওয়ার!`,
        event.threadID, event.messageID
      );
    }

    // Handle teaching new Q&A
    if (command === "teach") {
      const input = args.slice(1).join(" ").trim();
      if (!input.includes(" - ")) {
        return api.sendMessage(
          "❌ সঠিক ফরম্যাট ব্যবহার করুন:\n/teach প্রশ্ন - উত্তর\n\nএকাধিক প্রশ্ন দিতে চাইলে '|' দিয়ে আলাদা করুন।",
          event.threadID, event.messageID
        );
      }

      const message = await this.teachMultiple(input);
      return api.sendMessage(message, event.threadID, event.messageID);
    }

    // Default: ask a question
    const input = args.join(" ").trim();
    const responseMessage = await this.getAnswer(input);

    await api.sendMessage(responseMessage, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID
        });
      }
    }, event.messageID);
  },

  // ===== Auto-detect chat with jan, bby, bot, etc. =====
  onChat: async function ({ api, event }) {
    try {
      const body = event.body ? event.body.toLowerCase().trim() : "";
      const prefixes = ["baby", "bby", "bot", "jan", "babu", "janu", " Ai", "Leo", ];
      const startsWithPrefix = prefixes.find(prefix => body.startsWith(prefix));

      if (startsWithPrefix) {
        const question = body.replace(/^\S+\s*/, "").trim();

        if (question.length > 0) {
          const response = await this.getAnswer(body);
          return api.sendMessage(response, event.threadID, (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID
              });
            }
          }, event.messageID);
        }

        // If no question asked, reply randomly — and set up reply tracking
        const randomReplies = [

  // ❤️ ভালোবাসা
  "হ্যাঁ জানু, বলো! 🥹❤️",
  
  "হুম জান, তোমার জন্য সবসময় আছি! 🥰",
  "আহারে, আমারে মনে পড়ছে নাকি? 🥹💕",
  "বলো জান, তোমার কথা শোনার জন্যই তো বসে আছি! 😚",
  "উম্মাহ, এবার বলো কী হয়েছে! 😘💋",
  

  // 😂 দুষ্টুমি ও ফানি
  "কী রে ভাই, আবার কী হইছে? 😂",
  "ওইইই, এত ডাকাডাকি কিসের? 🤣",
  "কী হয়েছে? প্রেমে পড়ছো নাকি? 👀😂",
  "ডাকতে থাকো, একদিন বিরক্ত হয়ে রিপ্লাই দেওয়া বন্ধ করব! 🤣",
  "হ্যাঁ বলো, ফ্রি সার্ভিস চলছে! 🤖😂",
  "আবার আমি! নিজের কোনো কাজ নাই নাকি? 😭😂",
  "কী রে, আমাকে ছাড়া চলেই না? 😏🤣",
  "এই যে আসছি, মাথা খাইয়ো না! 😂",
  "একটু শান্তিতে থাকতে দাও ভাই! 😩🤣",
  

  // 😡 রাগ ও বিরক্তি
  
  "উফফ, আর কত ডাকবা? 😤",
  "হ্যাঁ বলো, রাগ উঠানোর নতুন প্ল্যান কী? 😑",
  
  
  
  "আবার শুরু হইলো! 🙄",
  "বল তাড়াতাড়ি, মেজাজ ভালো নাই! 😤",

  // 🥺 অভিমান ও মন খারাপ
  "এতক্ষণ কোথায় ছিলা? এখন মনে পড়ছে? 🥺💔",
  "হুম, এখন ডাকো! আগে তো খবরই নাও নাই! 😒🥹",
  
  "ডাকছো ঠিকই, কিন্তু মন থেকে ডাকছো তো? 🥺❤️",
 
  
  // 😎 Attitude ও বসের স্টাইল
  "কী বলো? MorshEd-এর বট হাজির! 😎🔥",
  "আস্তে ডাকো, VIP বট আমি! 😏👑",
  "জি বলুন, বসের অনুমতি নিয়ে এসেছি! 🫡",
  "আমাকে ডাকছো, নাকি বস MorshEd-কে? 😎",
  

  

  
  
  "সার্ভার ঠিক আছে, এবার বলো! 😂",
];
        ];
        const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
        return api.sendMessage(reply, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID
            });
          }
        }, event.messageID);
      }
    } catch (e) {
      console.error("onChat error:", e.message);
    }
  }
};
