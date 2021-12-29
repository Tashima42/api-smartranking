import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-palyer.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    this.logger.log(`Creating player: ${JSON.stringify(createPlayerDto)}`);
    const { email } = createPlayerDto;

    const player = this.getPlayerByEmail(email);

    if (player) {
      await this.update(player, createPlayerDto);
      return;
    }
    await this.create(createPlayerDto);
  }

  async getPlayers(): Promise<Player[]> {
    this.logger.log(`Getting all players`);
    return this.players;
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { name, email, phoneNumber } = createPlayerDto;
    const player: Player = {
      _id: await this.generateUuid(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      rankingPosition: 1,
      profilePictureUrl:
        'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
    };
    this.logger.log(`Created player: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private async update(
    player: Player,
    createPlayerDto: CreatePlayerDto,
  ): Promise<void> {
    this.logger.log(`Updating player: ${JSON.stringify(player)}`);

    const index = this.players.findIndex((p) => p._id === player._id);

    const { name, email, phoneNumber } = createPlayerDto;
    const { _id, ranking, rankingPosition, profilePictureUrl } = player;

    const updatedPlayer: Player = {
      _id,
      name,
      email,
      phoneNumber,
      ranking,
      rankingPosition,
      profilePictureUrl,
    };

    this.players[index] = updatedPlayer;
  }

  deletePlayer(email: string): void {
    this.logger.log(`Deleting player: ${email}`);
    const player = this.getPlayerByEmail(email);
    if (!player) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }
    const index = this.players.findIndex((p) => p._id === player._id);
    this.players.splice(index, 1);
  }

  getPlayerByEmail(email: string): Player {
    this.logger.log(`Getting player by email: ${email}`);
    return this.players.find((player) => player.email === email);
  }

  private async generateUuid(): Promise<string> {
    const crypto = await import('crypto');
    return crypto.randomUUID({ disableEntropyCache: true });
  }
}
