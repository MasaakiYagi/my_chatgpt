import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { animateScroll as scroll } from "react-scroll";
import axios from "axios";
import "./Chat.css";
import Message from "../message/Massage";
import MessageForm from "../messageform/MessageForm";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [sendValue, setSendValue] = useState("");
  const [height, setHeight] = useState(0);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const textAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const API_URL = "https://api.openai.com/v1/";
  const MODEL = "gpt-3.5-turbo";

  // #region 仮メッセージのハードコード
  useEffect(() => {
    // 直近10やり取りの読み取り
    setMessages([
      ...messages,
      { who: "me", message: "SAP Concurについて教えて" },
      {
        who: "bot",
        message:
          "SAP Concur（サップ・コンカー）は、ビジネストラベル・エクスペンス・マネジメントに特化したクラウドベースのソフトウェアです。旅費精算や経費管理の業務を効率化し、従業員の負担を軽減することができます。\
  \
        具体的には、出張や旅行の予約から精算までの一連の業務をシステム化し、自動化することができます。従業員は、スマートフォンやPCから、交通費や宿泊費などの請求書を申請し、承認されると自動的に経理システムに反映されます。また、業務で使用するクレジットカードの利用状況や予算の管理も可能です。\
        \
        SAP Concurは、企業の規模や業種に応じて、さまざまなプランを提供しています。また、多言語対応やグローバルな法規制にも対応しているため、世界各地でのビジネストラベルにも対応しています。",
      },
      { who: "me", message: "SAP Concurは、従業員のための経費精算の仕組み？" },
      {
        who: "bot",
        message:
          "はい、SAP Concurは、従業員の経費精算をより効率的に行うための仕組みです。従業員が出張や業務上必要な経費を支払った場合、その情報をスキャンやスマートフォンのカメラで撮影して、SAP Concurにアップロードすることで、支払った経費の情報を自動的に抽出し、承認フローを経て精算されます。また、SAP Concurは出張の予定や交通手段、宿泊先の検索・予約もできるため、出張全体の管理を一元化できます。",
      },
      { who: "me", message: "BlenderBIMとはなに？" },
      {
        who: "bot",
        message:
          "BlenderBIMは、オープンソースの3DモデリングソフトウェアであるBlenderを拡張し、建築情報モデリング（BIM）のための機能を提供するプラグインです。BlenderBIMは、建築業界においてBIMの作成、管理、分析、可視化を容易にすることを目的としています。BlenderBIMは無料で利用でき、オープンソースコミュニティによって開発されています。",
      },
      {
        who: "me",
        message: "BlenderBIMはRevit等の市販製品の代わりに使うことができる？",
      },
      {
        who: "bot",
        message:
          "BlenderBIMは、オープンソースのBIMモデリングツールであり、市販のBIM製品の代替として使用できる場合があります。ただし、BlenderBIMは現在、市販のBIM製品に比べて機能やサポート面で制限がありますので、適切に使用する必要があります。また、BlenderBIMはBIM業界で広く採用されているIFCフォーマットをサポートしているため、他のBIMツールとデータのやりとりが可能です。",
      },
      {
        who: "me",
        message: "BlenderBIMで実際の建築プロジェクトを遂行した例はある？",
      },
      {
        who: "bot",
        message:
          "はい、BlenderBIMを使用して実際に建設プロジェクトが遂行された例がいくつかあります。例えば、オーストラリアの建設会社であるHansen Yunckenは、BlenderBIMを使用して、BIMデータの視覚化、コラボレーション、および検証を行い、複数の建築プロジェクトを成功裏に実行しています。また、BlenderBIMを使用して、ヨーロッパの建設プロジェクトにおいても、BIMデータの作成や可視化、シミュレーションなどが行われています。",
      },
    ]);
  }, []);
  // #endregion

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth", // アニメーションの種類
      block: "end", // スクロールの位置
    });
  };

  const sendMessage = async () => {
    if (sendValue.trim() === "") {
      return;
    }
    setIsLoading(true);
    console.log("asking gpt...");
    setMessages([...messages, { who: "me", message: sendValue }]);

    try {
      const response = await axios.post(
        `${API_URL}chat/completions`,
        {
          // モデル ID の指定
          model: MODEL,
          // 質問内容
          messages: [
            {
              role: "user",
              content: sendValue,
            },
          ],
        },
        {
          // 送信する HTTP ヘッダー(認証情報)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      // const response = await axios(requestOptions);
      console.log(response.data);
      const generatedText = response.data.choices[0].message.content;
      // setResponses([...responses, { message, response: generatedText }]);
      // setMessage("");
      setIsLoading(false);
      setMessages([
        ...messages,
        { who: "me", message: sendValue },
        { who: "bot", message: generatedText },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textAreaRef.current) {
      setHeight(0); // テキストエリアの高さを初期値に戻す
    }
  }, [value]);

  useEffect(() => {
    // 高さが初期値の場合にscrollHeightを高さに設定する
    if (!height && textAreaRef.current) {
      setHeight(textAreaRef.current.scrollHeight);
    }
  }, [height]);

  const handleChangeValue = (value) => {
    setValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit:", value);
    setSendValue(value);
    sendMessage();
    // テキスト送信処理を実装する
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (
      (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
      e.keyCode === 13
    ) {
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <Message key={index} who={message.who} content={message.message} />
      ))}
      {isLoading && <LoadingIndicator />}
      <div className="bottom-gap"></div>
      <MessageForm
        value={value}
        handleChange={handleChangeValue}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
      />
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Chat;
