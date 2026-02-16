CREATE TABLE `access_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuario_id` int NOT NULL,
	`dominio` varchar(255) NOT NULL,
	`valor` int,
	`odds` varchar(50),
	`contexto_emocional` varchar(255),
	`usuario_aceitou_redirecionamento` int DEFAULT 0,
	`hobby_sugerido` varchar(255),
	`resultado` varchar(50),
	`data_hora` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `access_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gambling_websites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dominio` varchar(255) NOT NULL,
	`nome_site` varchar(255),
	`categoria` varchar(50),
	`pais` varchar(50),
	`ativo` int NOT NULL DEFAULT 1,
	`data_adicao` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gambling_websites_id` PRIMARY KEY(`id`),
	CONSTRAINT `gambling_websites_dominio_unique` UNIQUE(`dominio`)
);
--> statement-breakpoint
CREATE TABLE `premium_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuario_id` int NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'ativo',
	`data_inicio` timestamp NOT NULL DEFAULT (now()),
	`data_expiracao` timestamp,
	`stripe_subscription_id` varchar(255),
	`data_atualizacao` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `premium_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `premium_subscriptions_usuario_id_unique` UNIQUE(`usuario_id`)
);
--> statement-breakpoint
CREATE TABLE `user_hobbies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuario_id` int NOT NULL,
	`nome` varchar(255) NOT NULL,
	`data_criacao` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_hobbies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `access_attempts` ADD CONSTRAINT `access_attempts_usuario_id_users_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `premium_subscriptions` ADD CONSTRAINT `premium_subscriptions_usuario_id_users_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hobbies` ADD CONSTRAINT `user_hobbies_usuario_id_users_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;