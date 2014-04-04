# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table chat_message (
  id                        bigint not null,
  color                     varchar(255),
  creation_time             timestamp,
  message                   varchar(255),
  constraint pk_chat_message primary key (id))
;

create sequence chat_message_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists chat_message;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists chat_message_seq;

