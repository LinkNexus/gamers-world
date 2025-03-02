<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250213132059 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game_session ADD game_id INT NOT NULL');
        $this->addSql('ALTER TABLE game_session ADD type VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE
          game_session
        ADD
          CONSTRAINT FK_4586AAFBE48FD905 FOREIGN KEY (game_id) REFERENCES game (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_4586AAFBE48FD905 ON game_session (game_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE game_session DROP CONSTRAINT FK_4586AAFBE48FD905');
        $this->addSql('DROP INDEX IDX_4586AAFBE48FD905');
        $this->addSql('ALTER TABLE game_session DROP game_id');
        $this->addSql('ALTER TABLE game_session DROP type');
    }
}
