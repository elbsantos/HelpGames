CREATE TABLE `bets_blockages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`blocked_until` timestamp NOT NULL,
	`reason` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bets_blockages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bets_blockages` ADD CONSTRAINT `bets_blockages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;