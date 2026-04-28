// skakar rutan när man svarar fel

export const shakeScreen = (p: any) => {
  const shakeAmount = 5;
  p.translate(p.random(-shakeAmount, shakeAmount), p.random(-shakeAmount, shakeAmount));
};