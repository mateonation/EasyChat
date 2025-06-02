import { useParams } from "react-router-dom";
import ChatPage from "./chatpage";

const ChatPageWrapper = () => {
    const { chatId } = useParams();
    // Get user from localStorage
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

    const parsedChatId = Number(chatId);

    if (isNaN(parsedChatId)) return <div>Chat inválido</div>;
    if (!user?.id) return <div>Auth needed</div>; // If there's no user saved in localStorage, we assume the user is not authenticated.

    return <ChatPage chatId={parsedChatId} sessionUserId={user.id} />;
}

export default ChatPageWrapper;