select * from current_catalog
;

DROP TABLE public.user_roles;
DROP TABLE public.roles;
DROP TABLE public.user_profile;
DROP TABLE public.token;
DROP TABLE public.users;

CREATE TABLE public.users (
	id serial NOT NULL,
	email varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	isActivated boolean DEFAULT false,
	activationLink varchar(100) DEFAULT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE public.token (
	id serial NOT NULL,
	user_id int4 NOT NULL,
	refreshToken varchar(50) NOT NULL,
	CONSTRAINT token_pkey PRIMARY KEY (id),
	CONSTRAINT token_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE public.roles (
	id serial NOT NULL,
	"name" varchar(20) NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_roles (
	id serial NOT NULL,
	user_id int4 NOT NULL,
	role_id int4 NOT NULL,
	CONSTRAINT user_roles_pkey PRIMARY KEY (id),
	CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
	CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE public.user_profile (
	id serial NOT NULL,
	user_id int4 NOT NULL,
	firstname varchar(20) NOT NULL,
	lastname varchar(20) NOT NULL,
	CONSTRAINT user_profile_pkey PRIMARY KEY (id),
	CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--


insert into users values(nextval('users_id_seq'), 'sergey3@mail.ru', 'sds5465465@ddcd__', false)
;

select nextval('users_id_seq')
;