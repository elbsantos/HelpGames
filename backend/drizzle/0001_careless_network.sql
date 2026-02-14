CREATE TABLE `avoided_bets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`amount` int NOT NULL,
	`emotional_context` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `avoided_bets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crisis_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`message` text NOT NULL,
	`is_active` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crisis_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`monthly_income` int NOT NULL,
	`fixed_expenses` int NOT NULL,
	`leisure_budget` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`target_amount` int NOT NULL,
	`image_url` text,
	`is_completed` int NOT NULL DEFAULT 0,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `avoided_bets` ADD CONSTRAINT `avoided_bets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crisis_messages` ADD CONSTRAINT `crisis_messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financial_profiles` ADD CONSTRAINT `financial_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `goals` ADD CONSTRAINT `goals_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;