const config = {
  executablePath: process.env.CHROMIUM_BROWSER,
  args: ['--no-sandbox'],
};

module.exports = process.env.CHROMIUM_BROWSER ? config : {};
