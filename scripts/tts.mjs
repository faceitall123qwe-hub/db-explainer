import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { mkdirSync, renameSync, rmSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const VOICE = "ru-RU-DmitryNeural";
const RATE = "+8%";

// Spoken text; tech terms spelled phonetically so the voice reads them naturally.
const lines = [
  "Каждый раз, когда ты входишь в приложение, ищешь товар или смотришь историю заказов, где-то работает база данных. Как она устроена?",
  "Самые популярные базы реляционные. Данные хранятся в таблицах: строки это записи, а столбцы это поля, например имя, почта и город.",
  "У каждой строки есть уникальный номер, первичный ключ. По нему запись находится без путаницы, даже если двух людей зовут одинаково.",
  "С базой разговаривают на языке эс-кью-эль. Запрос селект говорит: дай мне имена пользователей из Варшавы. А как их найти, база решает сама.",
  "Есть четыре базовые операции: инсерт добавляет, селект читает, апдейт изменяет, а делит удаляет. Почти любое приложение построено на них.",
  "Таблицы связаны между собой. Заказ хранит номер клиента, а запрос с джойном соединяет заказы с именами клиентов.",
  "Чтобы поиск был быстрым, нужны индексы. Без индекса база просматривает все строки подряд, а с индексом сразу находит нужную, как по оглавлению книги.",
  "Транзакция объединяет несколько операций в одну. Например, перевод денег: списать с одного счёта и зачислить на другой. Выполняется либо всё, либо ничего.",
  "Бывают и нереляционные базы, но-эс-кью-эль. Например, документы в формате джейсон или пары ключ и значение. Они удобны, когда структура данных часто меняется.",
  "Таблицы, ключи, эс-кью-эль, индексы и транзакции. Так работают базы данных. Попробуй сам: открой онлайн-песочницу и выполни свой первый селект."
];

const only = process.argv[2] ? Number(process.argv[2]) : null;
const outRoot = "assets/audio";
mkdirSync(outRoot, { recursive: true });

for (let i = 0; i < lines.length; i++) {
  const n = String(i + 1).padStart(2, "0");
  if (only && only !== i + 1) continue;
  const tmp = join(outRoot, `tmp-${n}`);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, {
    wordBoundaryEnabled: true,
  });
  await tts.toFile(tmp, lines[i], { rate: RATE });
  tts.close();
  for (const f of readdirSync(tmp)) {
    const ext = f.endsWith(".mp3") ? "mp3" : "json";
    renameSync(join(tmp, f), join(outRoot, `vo-${n}.${ext}`));
  }
  rmSync(tmp, { recursive: true, force: true });
  console.log(`vo-${n} ok`, existsSync(join(outRoot, `vo-${n}.mp3`)));
}
