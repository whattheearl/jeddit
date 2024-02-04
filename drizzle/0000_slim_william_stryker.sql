CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(40),
	`email` varchar(256),
	`sub` varchar(256),
	`authority` varchar(256),
	`clientId` varchar(256),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_sub_unique` UNIQUE(`sub`)
);
