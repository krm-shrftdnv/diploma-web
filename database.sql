create
database offigator;

-- change schema

create table object_type
(
    id   serial  not null
        constraint object_type_pk
            primary key,
    name varchar not null
);
create
unique index object_type_name_uindex
    on object_type (name);

create table feature
(
    id        serial
        constraint feature_pk
            primary key,
    name      varchar not null,
    queue_in  varchar,
    queue_out varchar
);
create
unique index feature_name_uindex
    on feature (name);

create table object
(
    id             serial
        constraint object_pk
            primary key,
    object_type_id int not null
        constraint "fk-object-object_type_id"
            references object_type
            on update cascade on delete cascade,
    longitude      float,
    latitude       float
);

create table object_type_feature
(
    id             serial
        constraint object_type_feature_pk
            primary key,
    object_type_id int not null
        constraint "fk-object_type_feature-object_type_id"
            references object_type
            on update cascade on delete cascade,
    feature_id     int not null
        constraint "fk-object_type_feature-feature_id"
            references feature
            on update cascade on delete cascade
);

create table feature_value
(
    id         serial
        constraint feature_value_pk
            primary key,
    object_id  int     not null
        constraint "fk-feature_value-object_id"
            references object
            on update cascade on delete cascade,
    feature_id int     not null
        constraint "fk-feature_value-feature_id"
            references feature
            on update cascade on delete cascade,
    value      varchar not null
);

create table map
(
    id        serial
        constraint map_pk
            primary key,
    name      varchar not null,
    latitude  double precision,
    longitude double precision,
    image     varchar not null
);