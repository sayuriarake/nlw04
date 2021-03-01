import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';

import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from '../services/SendMailService';
import { AppError } from '../errors/AppError';
import { app } from '../app';

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            throw new AppError("Usuário não existe");
        }

        const survey = await surveysRepository.findOne({ id: survey_id });

        if (!survey) {
            throw new AppError("Pesquisa não existe");
        }
                
        

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const userSurvey = await surveysUsersRepository.findOne({ 
            where: { user_id: user.id , value: null, survey_id: survey_id },
            relations: ["user", "survey"],  
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        }
        
        if(userSurvey){
            variables.id = userSurvey.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(userSurvey);
        }


        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser);

        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController }