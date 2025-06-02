import { useParams } from "react-router-dom";
import ChatPage from "./chatpage";

const sessionUserId = 123; // REPLACE WITH ACTUAL SESSION USER ID

const ChatPageWrapper = () => {
    const { chatId } = useParams();

    const parsedChatId = Number(chatId);

    if (isNaN(parsedChatId)) return <div>Chat inválido</div>;

    return <ChatPage chatId={parsedChatId} sessionUserId={sessionUserId} />;
}

export default ChatPageWrapper;