import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-palyer.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  private readonly logger = new Logger(PlayersController.name);
  constructor(private readonly playersService: PlayersService) {}
  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    this.logger.log(
      `Create or udpate player ${JSON.stringify(createPlayerDto)}`,
    );
    return await this.playersService.createUpdatePlayer(createPlayerDto);
  }

  @Get()
  async getPlayers(@Query('email') email: string) {
    if (email) {
      this.logger.log(`Get palyer by email ${JSON.stringify(email)}`);
      const player = this.playersService.getPlayerByEmail(email);
      if (!player) {
        throw new NotFoundException(`Player with email ${email} not found`);
      }
      return player;
    }
    this.logger.log('Get all players');
    return await this.playersService.getPlayers();
  }

  @Delete()
  async deletePlayer(@Query('email') email: string) {
    this.logger.log(`Delete player ${JSON.stringify(email)}`);
    return this.playersService.deletePlayer(email);
  }
}
