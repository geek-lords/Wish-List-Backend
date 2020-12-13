create table country
(
    id   int AUTO_INCREMENT primary key,
    name text not null
);

create table wish
(
    id   int AUTO_INCREMENT primary key,
    name text not null
);


create table country_wish
(
    country_id int,
    wish_id    int not null,
    foreign key (country_id) references country (id),
    foreign key (wish_id) references wish (id)
);

insert into country(name)
values ('India'),
       ('United States'),
       ('Australia'),
       ('China'),
       ('Russia'),
       ('New Zealand'),
       ('Pakistan'),
       ('United Arab Emirates'),
       ('Indonesia'),
       ('Bangladesh'),
       ('Nepal'),
       ('Maldives');

alter table country_wish add column count int not null;
alter table country_wish add primary key (country_id, wish_id);
create table email ( email_id varchar(200) primary key );