const { bot } = require("../bot");
const TiaraShaktiGenerator = require("../generator/TiaraShakti");
const { teleImgCompress } = require("../lib/Util");

bot.command('mager', (ctx) => {
  ctx.replyWithHTML(ctx.locale['writejs_prompt'], { disable_web_page_preview: true });
  ctx.userCache.awaitResponse = 'write';
  ctx.toMenu(ctx, true);
});

bot.on('text', async (ctx, next) => {
  const userCache = ctx.userCache;
  if (!userCache.awaitResponse.startsWith('mager')) return next();

  ctx.reply(ctx.locale['writejs_wait']);
  let Generator;
  const paper = userCache.paper;
  if (paper == 'images') {
    Generator = new TiaraShaktiGenerator(userCache);
  } else {
    Generator = new TiaraShaktiGenerator(userCache);
  }
  Generator.image = paper;
  try {
    await Generator.loadImage();
    await Generator.mager(ctx.message.text);
    // Generator.mager(ctx.message.text, 130, 150);
    for (const buff of Generator.buffers) {
      const compressed = await teleImgCompress(buff);
      await ctx.replyWithPhoto({ source: compressed });
    }
  } catch (e) {
    logger.error(e.stack);
  }

  ctx.toMenu(ctx);
  userCache.awaitResponse = '';

  return next();
});
