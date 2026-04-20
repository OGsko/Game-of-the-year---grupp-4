import p5 from 'p5';
import { startPage } from './startpage';
import { gameSketch } from './game';
import './Sass/_main.scss';

startPage();

const gameContainer = document.createElement("div");
gameContainer.id = ("#gameContainer");

const body = document.querySelector("body");

body?.append(gameContainer);
