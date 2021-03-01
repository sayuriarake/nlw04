import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { stringify } from "uuid";
import { AppError } from '../errors/AppError';
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";

class AnswerController{
    async execute(request: Request, response: Response){
        const {value}  = request.params;
        const {u} = request.query;

        const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u),
        });

        if(!surveyUser){
            throw new AppError("Pesquisa do usuário não existe!");
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);

    }
}

export { AnswerController}