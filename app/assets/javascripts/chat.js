$(document).ready(function(){

    function Message(data) {
        this.message = ko.observable(data.message);
        this.color = ko.observable("#"+data.color);
        this.timeStamp = data.timeStamp;
    }

    function ChatMessageListViewModel() {
        // Data
        var self = this;
        self.messages = ko.observableArray([]);
        self.showErrorMessage = ko.observable(false);
        self.showDisconnectMessage = ko.observable(false);

        self.save = function() {
            chatSocket.send(JSON.stringify({text: $("#newMessage").val()}));
            $("#newMessage").val('');
        };
        self.check = function(){
            var event = arguments[1];
            if(event.which == 13 && !event.shiftKey){
                event.preventDefault();
                self.save();
            }
        };
        self.add = function(data){
            self.messages.unshift(new Message(data));
        };

        if(typeof WebSocket == "undefined"){
            self.showErrorMessage(true);
            return;
        }
        var chatSocket = new WebSocket(jsRoutes.controllers.Application.chat().webSocketURL('response'));

        chatSocket.onmessage = function(event){
            data = JSON.parse(event.data);
            console.log(data);

            switch(data.kind){
                case "join":
                    self.add(data);
                    break;
                case "talk":
                    //self.update();
                    self.add(data);
                    break;
            }
        };
        chatSocket.onerror = function(event){
            self.showErrorMessage(true);
        };
        chatSocket.onclose = function(event){
            if(!self.showErrorMessage())
                self.showDisconnectMessage(true);
        };
    }

    // Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
    // Could be stored in a separate utility library
    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    ko.applyBindings(new ChatMessageListViewModel());
});



