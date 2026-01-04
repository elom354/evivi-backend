import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsUrl, ArrayMinSize } from 'class-validator';

/**
 * DTO pour la mise à jour de la photo de profil
 */
export class UpdateProfileDto {
  @ApiProperty({
    type: String,
    description: "L'URL de la photo de profil",
    example: 'https://cdn.app.com/images/profile.jpg',
  })
  @IsString({ message: "L'URL doit être une chaîne de caractères" })
  @IsUrl({}, { message: "L'URL doit être une URL valide" })
  @IsNotEmpty({ message: "L'URL de la photo de profil est obligatoire" })
  profileUrl: string;
}

/**
 * DTO pour l'ajout de médias
 */
export class AddMediaDto {
  @ApiProperty({
    type: [String],
    description: 'Liste des URLs des médias à ajouter',
    example: [
      'https://cdn.app.com/images/1.jpg',
      'https://cdn.app.com/images/2.jpg',
    ],
    minItems: 1,
  })
  @IsArray({ message: 'Les URLs doivent être un tableau' })
  @ArrayMinSize(1, { message: 'Au moins une URL est requise' })
  @IsUrl({}, { each: true, message: 'Chaque URL doit être une URL valide' })
  @IsNotEmpty({ message: 'Les URLs des médias sont obligatoires' })
  urls: string[];
}

/**
 * DTO pour la suppression d'un média
 */
export class RemoveMediaDto {
  @ApiProperty({
    type: String,
    description: "L'URL du média à supprimer",
    example: 'https://cdn.app.com/images/1.jpg',
  })
  @IsString({ message: "L'URL doit être une chaîne de caractères" })
  @IsUrl({}, { message: "L'URL doit être une URL valide" })
  @IsNotEmpty({ message: "L'URL du média est obligatoire" })
  url: string;
}

