async function isCaptchaPresent(page) {
  const captchaElement = await page.$("img[alt='captcha']");
  return Boolean(captchaElement);
}

module.exports = { isCaptchaPresent };
