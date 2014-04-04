package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import models.ChatRoom;
import play.Routes;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.WebSocket;
import views.html.defaultpages.error;
import views.html.index;

public class Application extends Controller {

    /** Handle incomming requests */
    public static Result index() {
        if(session("color")==null || session("color").isEmpty()){
            session("color", generateRandomColor());
        }else {
            ChatRoom.doNotSendJoin(true);
        }
        return ok(index.render());
    }

    /** Just give each session using the socket its own chat color */
    private static String generateRandomColor(){
        String randomizeColor = "9ABCDEF";
        String result = "";
        for(int i =0 ; i<3; i++){
            result+= randomizeColor.charAt(0+(int)(Math.random() * randomizeColor.length()));
        }
        return result;
    }

    /** Handle the chat websocket */
    public static WebSocket<JsonNode> chat() {
        final Http.Session sess = session();
        final String color = sess.get("color");//better version

        return new WebSocket<JsonNode>() {

            // Called when the Websocket Handshake is done.
            public void onReady(WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out){

                // Join the chat room.
                try {
                    ChatRoom.join(color, in, out);
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }

        };
    }

    /** Create reverse routing for js */
    public static Result javascriptRoutes() {
        response().setContentType("text/javascript");
        return ok( Routes.javascriptRouter("jsRoutes", controllers.routes.javascript.Application.chat()) );
    }

}
