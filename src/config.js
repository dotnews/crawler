const config = {
  executablePath: process.env.CHROMIUM_BROWSER,
  args: ['--no-sandbox'],
};

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

module.exports = process.env.CHROMIUM_BROWSER ? config : {};
