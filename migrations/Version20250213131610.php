<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250213131610 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE game_session (
          id SERIAL NOT NULL,
          initiator_id INT NOT NULL,
          winner_id INT DEFAULT NULL,
          is_completed BOOLEAN NOT NULL,
          PRIMARY KEY(id)
        )');
        $this->addSql('CREATE INDEX IDX_4586AAFB7DB3B714 ON game_session (initiator_id)');
        $this->addSql('CREATE INDEX IDX_4586AAFB5DFCD4B8 ON game_session (winner_id)');
        $this->addSql('CREATE TABLE game_session_user (
          game_session_id INT NOT NULL,
          user_id INT NOT NULL,
          PRIMARY KEY(game_session_id, user_id)
        )');
        $this->addSql('CREATE INDEX IDX_A532E20D8FE32B32 ON game_session_user (game_session_id)');
        $this->addSql('CREATE INDEX IDX_A532E20DA76ED395 ON game_session_user (user_id)');
        $this->addSql('ALTER TABLE
          game_session
        ADD
          CONSTRAINT FK_4586AAFB7DB3B714 FOREIGN KEY (initiator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE
          game_session
        ADD
          CONSTRAINT FK_4586AAFB5DFCD4B8 FOREIGN KEY (winner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE
          game_session_user
        ADD
          CONSTRAINT FK_A532E20D8FE32B32 FOREIGN KEY (game_session_id) REFERENCES game_session (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE
          game_session_user
        ADD
          CONSTRAINT FK_A532E20DA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE game_session DROP CONSTRAINT FK_4586AAFB7DB3B714');
        $this->addSql('ALTER TABLE game_session DROP CONSTRAINT FK_4586AAFB5DFCD4B8');
        $this->addSql('ALTER TABLE game_session_user DROP CONSTRAINT FK_A532E20D8FE32B32');
        $this->addSql('ALTER TABLE game_session_user DROP CONSTRAINT FK_A532E20DA76ED395');
        $this->addSql('DROP TABLE game_session');
        $this->addSql('DROP TABLE game_session_user');
    }
}
