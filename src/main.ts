import p5 from 'p5';
import { startPage } from './startpage';
import { gameSketch } from './game';
import './Sass/_main.scss';

//fetch functions
import { fetchQuestion } from './modules/fetch';
import { fetchAvatar } from './modules/fetch';
import { fetchScoreBoard } from './modules/fetch';


startPage();

const gameContainer = document.createElement("div");
gameContainer.id = ("#gameContainer");

const body = document.querySelector("body");

body?.append(gameContainer);


