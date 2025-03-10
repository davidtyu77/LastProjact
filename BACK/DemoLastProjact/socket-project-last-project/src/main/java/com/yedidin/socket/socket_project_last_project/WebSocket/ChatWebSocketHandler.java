package com.yedidin.socket.socket_project_last_project.WebSocket;

import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.CloseStatus;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    // מאגר חיבורים: מפת מזהה משתמש ל-WebSocketSession
    private final Map<String, WebSocketSession> usersSessions = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // כאן אנחנו מניחים שהמשתמש שולח את מזהה המשתמש כבר בזמן החיבור או שאנחנו שולחים אותו
        String userId = getUserIdFromSession(session);  // השגת מזהה המשתמש
        usersSessions.put(userId, session);
        System.out.println("New connection: " + userId);

        // שליחה למשתמש את ה-USER_ID שלו (אפשרות להציג לו אותו בצד הלקוח)
        session.sendMessage(new TextMessage("USER_ID:" + userId));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // המידע שמגיע בצורת "recipientId:message"
        String[] parts = message.getPayload().split(":", 2);
        String recipientId = parts[0].trim();  // מזהה המשתמש שאליו אתה רוצה לשלוח את ההודעה
        String messageText = parts[1].trim();  // ההודעה

        // עכשיו אנחנו מוצאים את ה-Session של המשתמש המבוקש
        WebSocketSession recipientSession = usersSessions.get(recipientId);

        if (recipientSession != null && recipientSession.isOpen()) {
            // אם החיבור פתוח, שלח את ההודעה
            recipientSession.sendMessage(new TextMessage("Message from " + getUserIdFromSession(session) + ": " + messageText));
        } else {
            // אם לא ניתן למצוא את המשתמש או החיבור סגור
            session.sendMessage(new TextMessage("User " + recipientId + " is not available."));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // כאשר החיבור נסגר, נמחק את ה-session מהמפה
        String userId = getUserIdFromSession(session);
        usersSessions.remove(userId);
        System.out.println("Connection closed: " + userId);
    }

    // פוקנציה שמחזירה את ה-userId של החיבור
    private String getUserIdFromSession(WebSocketSession session) {
        // ניתן לשלוף את ה-userId ממסד נתונים או מכל מקור אחר שאתה משתמש בו (הנה פשוט השתמשנו ב-session.getId())
        return session.getId();  // לשם הפשטות משתמשים ב-session.getId(), אפשר לשדרג
    }
}