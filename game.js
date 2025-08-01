// Hebrew Trivia Tower Game - Enhanced Edition
// מגדל הטריוויה העברי - מהדורה מורחבת

// Game state for multiple players
let gameState = {
    isPlaying: false,
    isPaused: false,
    gameMode: 'single', // 'single', 'multiplayer', 'learning', 'stories'
    currentPlayer: 0,
    players: [
        { name: 'שחקן 1', score: 0, tower: [], categoryCount: { geography: 0, history: 0, culture: 0, science: 0, sport: 0, food: 0, nature: 0, celebrities: 0, indigenous: 0 } }
    ],
    currentCard: null,
    selectedDifficulty: null,
    deck: [],
    timer: null,
    timeLeft: 30,
    questionsAnswered: 0,
    gameStartTime: null,
    selectedAnswer: null,
    usedQuestions: new Set(),
    learningMode: {
        wrongAnswers: [],
        reviewMode: false
    },
    stories: [],
    dictionary: {},
    currentStory: null
};

// Load questions from external JSON file
let QUESTIONS_DATABASE = {};

// Canadian Stories Database - מורחב משמעותית
const STORIES_DATABASE = [
    {
        id: 'confederation',
        title: 'הקונפדרציה הקנדית - לידתה של מדינה',
        content: `ב-1 ביולי 1867, נולדה קנדה המודרנית. זה לא היה רק תאריך בלוח השנה, אלא רגע היסטורי שיצר את אחת המדינות המצליחות בעולם.

הסיפור מתחיל בשנות ה-60 של המאה ה-19, כאשר ארבע קולוניות בריטיות נפרדות החליטו להתאחד. אונטריו (אז קנדה העליונה), קוויבק (אז קנדה התחתונה), נובה סקוטיה וניו ברנזוויק היו כל אחת עם האתגרים שלה.

ג'ון א. מקדונלד, שהפך לראש הממשלה הראשון, חלם על מדינה גדולה שתמתח מים לים. הוא האמין שרק באיחוד יוכלו הקולוניות להתמודד עם האיום האמריקאי מדרום ולבנות כלכלה חזקה.

הדרך לא הייתה קלה. רבים בנובה סקוטיה התנגדו לאיחוד, בזמן שבקוויבק היו חששות משימור התרבות הצרפתית. אך בסופו של דבר, החזון של "מדינה מאגם לאגם" ניצח.

ב-1 ביולי 1867, המלכה ויקטוריה חתמה על חוק צפון אמריקה הבריטית, ורגע אחד הפכו ארבע קולוניות נפרדות לדומיניון של קנדה. זה היה מעשה של אמונה, של תקווה ושל החלטה לבנות משהו גדול יותר מסכום חלקיו.

היום, כששאנחנו חוגגים את יום קנדה, אנחנו זוכרים לא רק את הרגע ההיסטורי הזה, אלא את הערכים שהובילו אליו: איחוד, פשרה ובניית עתיד משותף למרות הבדלים.`,
        category: 'history',
        difficulty: 'junior'
    },
    {
        id: 'maple_syrup_tradition',
        title: 'סירופ האדר - הזהב המתוק של קנדה',
        content: `הרבה לפני שהמתיישבים האירופאים הגיעו לצפון אמריקה, העמים הילידיים כבר גילו את אחד האוצרות הטבעיים הגדולים ביותר של היבשת - סירופ האדר.

האגדה מספרת על צ'יף אינדיאני שזרק את הגרזן שלו לעץ אדר בסוף החורף. כשאשתו הבחינה במיץ המתוק שזלג מהעץ, היא החליטה לבשל איתו. כך נתגלה המתיקות הטבעית של עץ האדר.

בפועל, עמי האוג'יבווה, האירוקים והאלגונקים פיתחו טכניקות מתוחכמות לאיסוף המיץ. הם ירו חצים חדים לעץ, הכניסו קנים חלולים ואספו את המיץ בכלי חרס. התהליך היה קשה ודרש סבלנות רבה.

כאשר המתיישבים הצרפתים הגיעו למה שהיום נקרא קוויבק, הם למדו מהעמים הילידיים את סודות האדר. הם שיפרו את השיטות, הכניסו דליים מתכת ופיתחו טכניקות זיקוק מתקדמות יותר.

במאה ה-19, ייצור סירופ האדר הפך לתעשייה. משפחות שלמות היו עוזבות את בתיהן באביב ועוברות ל"שאק האדר" - בקתות קטנות ביער שבהן הם היו מבלים שבועות בבישול המיץ.

התהליך מתחיל כאשר הלילות עדיין קרים אבל הימים מתחממים - בדרך כלל במרץ ואפריל. זו התקופה שבה המיץ זורם הכי טוב. צריך 40 ליטר מיץ אדר כדי לייצר ליטר אחד של סירופ!

היום, קנדה מייצרת 71% מסירופ האדר בעולם, עם קוויבק שמובילה בייצור. התעשייה ששווה מאות מיליוני דולרים שומרת על המסורת הקדומה - כל אביב, כאשר הקרח מתחיל להימס, מתחילה שוב הקסם הקדום של האדר.

הטעם המתוק והעשיר של סירופ האדר הקנדי הפך לסמל הזהות הלאומית. זה לא רק ממתיק - זה הקשר שלנו לטבע, למסורת ולחכמה הקדומה של העמים הילידיים.`,
        category: 'food',
        difficulty: 'junior'
    },
    {
        id: 'residential_schools_truth',
        title: 'בתי הספר הפנימיים - פרק כואב בהיסטוריה הקנדית',
        content: `זהו אחד הפרקים הכואבים והחשובים ביותר בהיסטוריה הקנדית - סיפור בתי הספר הפנימיים שהותיר צלקות עמוקות בלב העמים הילידיים.

החל מ-1870 ועד 1996, מערכת של בתי ספר פנימיים פעלה ברחבי קנדה. המטרה הרשמית הייתה "לחנך" ילדים ילידיים, אך המטרה האמיתית הייתה "להרוג את האינדיאני בילד" - ביטוי שנאמר על ידי קפטן ריצ'רד הנרי פראט, שהשפיע על המדיניות הקנדית.

יותר מ-130 בתי ספר פנימיים פעלו במדינה. הילדים נלקחו מבתיהם בכוח, לעיתים בגיל צעיר מאוד. הם לא הורשו לדבר בשפתם המקורית, לקיים את המסורות שלהם או אפילו להיפגש עם אחיהם בבית הספר.

התנאים בבתי הספר היו קשים. הילדים סבלו מתת-תזונה, מחלות וכפיפות פיזית ורגשית. רבים מהם מתו ממחלות, ואלפים אחרים נעלמו ללא עקבות. המטרה הייתה למחוק את זהותם התרבותית ולהכניס אותם לחברה הקנדית כפועלים.

האימפקט היה הרסני. דורות שלמים של ילדים ילידיים איבדו את הקשר לשפתם, למסורתיהם ולמשפחותיהם. כאשר הם חזרו הביתה, הם לא יכלו לתקשר עם הוריהם ולא הכירו את התרבות שלהם. זה יצר מעגל של טראומה שעבר מדור לדור.

בשנת 2008, ראש הממשלה סטיבן הארפר הציג התנצלות רשמית בפרלמנט הקנדי. "אנחנו מתנצלים", הוא אמר, "על ההפרדה הכפויה של ילדים ממשפחותיהם, על ניתוק הקשרים התרבותיים והרוחניים, ועל האובדן השפה והתרבות."

ועדת האמת והפיוס, שסיימה את עבודתה ב-2015, תיעדה את היקף הטרגדיה. הדוח כלל 94 קריאות לפעולה לממשלה ולחברה הקנדית. אחת המשמעותיות שבהן הייתה הקמת יום חדש - יום האמת והפיוס (30 בספטמבר), שבו כל הקנדים מתבקשים ללמוד על ההיסטוריה הזו ולהחזיק בעוול שנעשה.

היום, קנדה מנסה להתמודד עם המורשת הכואבת הזו. בתי ספר לומדים על ההיסטוריה האמיתית, יש השקעות בחינוך ותרבות ילידיים, ומתקיים דיאלוג על איך לרפא את הנזק.

הסיפור של בתי הספר הפנימיים הוא תזכורת לכך שגם מדינות דמוקרטיות יכולות לבצע עוולות נוראות. אבל זה גם סיפור על אומץ - הילדים ששרדו, הקהילות שהחזיקו מעמד, והמאמץ הנוכחי לרפא ולבנות עתיד טוב יותר.

זהו לא רק סיפור על העבר - זה סיפור על האחריות שלנו היום ליצור חברה צודקת יותר לכל הקנדים.`,
        category: 'indigenous',
        difficulty: 'expert'
    },
    {
        id: 'hockey_birth',
        title: 'לידת ההוקי - הספורט שאיחד את קנדה',
        content: `בערב קר בחורף של 1875, תשעה סטודנטים מאוניברסיטת מקגיל במונטריאול החליטו לנסות משהו חדש. הם לקחו מקלות, כדור גומי קטן ויצאו לקרח. מה שקרה אותו ערב בחודש מרץ היה לידתו של הספורט הכי אהוב בקנדה - הוקי קרח.

ג'יימס קרייטון, סטודנט בן 23, ארגן את המשחק הראשון. הוא נחשב ל"אבי ההוקי המודרני" לא בגלל שהמציא את המשחק - שחקני קרח היו קיימים הרבה לפני כן - אלא בגלל שהוא קבע כללים ברורים.

הכללים הראשונים של קרייטון היו פשוטים: שתי קבוצות של תשעה שחקנים (לא שישה כמו היום), שער מעץ, וכדור גומי במקום הפאק המתכתי שאנחנו מכירים היום. המטרה הייתה פשוטה - להכניס את הכדור לשער של היריב.

אבל למה דווקא בקנדה? התשובה פשוטה - החורף הקנדי. במקום שבו שלג וקרח מכסים את הקרקע חודשים רבים בשנה, המצאת ספורט חורפי הייתה הכרחית. הקנדים לקחו משחקים אירופאים כמו הוקי שדה ובנדי ועיבדו אותם לקרח.

המשחק התפשט מהר. ב-1879 הוקמה האגודה הקנדית להוקי קרח, וב-1893 נתרם הגביע המפורסם ביותר בספורט - גביע סטנלי, על ידי הלורד סטנלי אוף פרסטון, הגנרל המושל של קנדה.

מה שהתחיל כמשחק של סטודנטים הפך במהירות לתופעה לאומית. בכל קהילה בקנדה הוקמה מגרש קרח, וילדים למדו להחליק עוד לפני שלמדו לרכב על אופניים. הוקי הפך לא רק לספורט, אלא לשפה משותפת שאיחדה את קנדה.

הספורט התפתח במהירות. ב-1917 הוקמה ליגת ההוקי הלאומית (NHL) עם ארבע קבוצות קנדיות. שחקנים כמו מוריס "רוקט" ריצ'רד ממונטריאול קנדיינס הפכו לגיבורים לאומיים.

וויין גרצקי, שנולד בברנטפורד אונטריו, הוא הדוגמה המושלמת לקסם ההוקי הקנדי. כילד, הוא התחיל להחליק בגיל שנתיים על באקיארד שלו שהוריו הציפו במים. עד שהגיע ל-NHL, הוא כבר היה אגדה.

אבל ההוקי בקנדה הוא הרבה יותר מאשר ספורט מקצועי. זה הקהילה המקומית שמתכנסת בזירה הקטנה לעודד את הילדים. זה האבא שקם בחמש בבוקר כדי לקחת את הבן לאימון. זה הרגש של אחדות כאשר הנבחרת הקנדית משחקת באולימפיאדה.

ההוקי לימד את הקנדים ערכים חשובים: עבודת צוות, התמדה במזג אוויר קשה, וכבוד ליריב. אולי זה אחד הסיבות למה הקנדים נחשבים לאנשים נחמדים - הם למדו לכבד את הכללים של המשחק.

היום, כאשר הוקי נשחק ברחבי העולם, קנדה עדיין נשארה הבית האמיתי של הספורט הזה. זה המקום שבו נולד, המקום שבו הוא חי ונושם, והמקום שבו כל ילד חולם להפוך לשחקן גדול.

מהסטודנטים התשעה שיצאו לקרח במונטריאול ב-1875 ועד היום, הוקי נשאר הספורט שמאחד את קנדה - מחוף לחוף, משפה לשפה, מדור לדור.`,
        category: 'sport',
        difficulty: 'junior'
    },
    {
        id: 'terry_fox_marathon',
        title: 'טרי פוקס - גיבור של תקווה',
        content: `ב-12 באפריל 1980, צעיר בן 22 עם רגל מלאכותית יצא לריצה מסנט ג'ונס, ניופאונדלנד. הוא לא ידע שהוא עומד להפוך לאחד הגיבורים הכי אהובים בהיסטוריה הקנדית.

טרי פוקס נולד בויניפג ב-1958 וגדל בפורט קוקיטלם, בריטיש קולומביה. הוא היה נער רגיל שאהב ספורט, במיוחד כדורסל. חלומו היה לשחק בנבחרת האוניברסיטה. אבל בגיל 18, החיים שלו השתנו לחלוטין.

מרץ 1977 - הרופאים אבחנו אצל טרי סרטן עצם ברגל ימין. היחידה דרך לעצור את המחלה הייתה קטיעת הרגל מעל הברך. עבור בחור צעיר שכל חייו סבבו סביב ספורט, זה היה מכה קשה.

אבל במהלך הטיפולים בבית החולים, טרי ראה ילדים צעירים שנלחמים בסרטן. הוא ראה כמה הם סובלים, כמה המשפחות נאבקות, וכמה המחקר על הסרטן זקוק למימון. זה נתן לו רעיון מטורף.

הוא החליט לרוץ מחוף לחוף של קנדה - 8,000 קילומטר - כדי לגייס כסף למחקר סרטן. הוא קרא למסע שלו "מרתון התקווה".

ההכנות לקחו שלוש שנים. טרי רץ כל יום, בגשם ובשלג, בחום ובקור. הוא פיתח סגנון ריצה ייחודי - צעד אחד עם הרגל הבריאה, קפיצה עם הרגל המלאכותית. זה נראה מוזר, אבל זה עבד.

ב-12 באפריל 1980, טרי טבל את הרגל המלאכותית באוקיינוס האטלנטי ובדמעות בעיניים התחיל לרוץ. הרעיון היה פשוט - לרוץ מרתון אחד (42.2 ק"מ) כל יום עד שיגיע לאוקיינוס השקט בונקובר.

בהתחלה, אמצעי התקשורת כמעט לא שמו לב. אבל ככל שטרי התקדם מזרחה, התחילו להתאסף קהלים. באונטריו, אלפי אנשים יצאו לרחובות לעודד לו. הוא הפך לגיבור לאומי.

טרי רץ 143 ימים. 5,373 קילומטר. מרתון אחד כל יום, אפילו כשהיה חולה או כואב לו. הוא גייס מעל מיליון דולר בדרך.

אבל ב-1 בספטמבר 1980, ליד ת'אנדר ביי באונטריו, טרי התמוטט. הסרטן חזר ובמקומותיו. הריאות שלו היו מלאות גידולים. הוא נאלץ לעצור את הריצה.

"אני לא מרגיש שזה הסוף", הוא אמר בהודעה לתקשורת. "איכשהו אמשיך. אני צריך לתת לאנשים תקווה."

טרי חזר לבריטיש קולומביה לטיפולים, אבל ה-28 ביוני 1981, בגיל 22, הוא נפטר. בזמן מותו, הוא כבר גייס מעל 24 מיליון דולר למחקר סרטן.

אבל זה לא היה הסוף. "מרתון התקווה" ההודי שלו הפך לתנועה עולמית. כל שנה, במיליוני אנשים ברחבי העולם רצים ונותרים כסף בשמו של טרי. עד היום, יותר מ-850 מיליון דולר נאספו במסגרת קרן טרי פוקס.

בקנדה, טרי פוקס הוא יותר מגיבור - הוא סמל של מה שאפשר להשיג כאשר יש רצון, נחישות ולב גדול. יש לו פסלים ברחבי המדינה, הוא מופיע על הכסף, ושמו על בתי ספר, רחובות ומחקרים.

הסיפור של טרי פוקס מלמד אותנו שגיבורים אמיתיים לא לובשים גלימות. לפעמים הם צעירים רגילים עם רגל מלאכותית וחלום גדול. לפעמים הגיבורה האמיתית היא לא לנצח, אלא לנסות - ולתת לאחרים תקווה.

"כל מה שאני מבקש", אמר טרי פוקס, "זה שיימשך המחקר". 40 שנה אחרי מותו, המחקר נמשך, החיים מתעלים - והמרתון של התקווה רץ הלאה.`,
        category: 'celebrities',
        difficulty: 'expert'
    },
    {
        id: 'northern_lights',
        title: 'הזוהר הצפוני - קסם השמיים הקנדי',
        content: `בלילות החורף הקרים של הצפון הקנדי, כאשר השמים בהירים וכוכבים נוצצים, מתרחש אירוע קסום. וילונות אור בירוק, כחול, סגול וורוד רוקדים על פני השמיים - זה הזוהר הצפוני, אחד הנופים הטבעיים הכי מרהיבים שאפשר לראות בקנדה.

הזוהר הצפוני, או Aurora Borealis, הוא תופעה שהקסימה את האנושות אלפי שנים. בקנדה, הוא נראה בצורה הכי טובה בטריטוריות הצפון-מערביות, יוקון, נונבוט ובחלקים הצפוניים של המחוזות.

המדע מאחורי הזוהר הוא מרהיב כמו התופעה עצמها. כל הזמן, השמש שולחת זרימה של חלקיקים טעונים החללה - מה שנקרא "רוח שמש". כאשר החלקיקים הללו מגיעים לכדור הארץ, הם נפגשים עם השדה המגנטי של הפלנטה שלנו.

השדה המגנטי של הארץ מפנה את החלקיקים לקטבים, שם הם מתנגשים עם גזים באטמוספירה - בעיקר חמצן וחנקן. ההתנגשות הזו גורמת לגזים להאיר, בדיוק כמו אור ניאון. חמצן נותן צבע ירוק וירוק, חנקן נותן כחול וסגול.

אבל לפני שהמדע הסביר את התופעה, העמים הילידיים בקנדה היו להם הסברים קסומים משלהם. האינואיטים האמינו שהזוהר הצפוני הם רוחות של המתים שרוקדים בשמיים. האוג'יבווה ראו בו אש שמדליקים האלים. בחלק מהתרבויות, האמינו שאם תשרוק לזוהר הצפוני, הוא ירד קרוב יותר.

הצפון הקנדי הוא אחד המקומות הטובים בעולם לצפייה בזוהר הצפוני. עיירות כמו יילונייף בטריטוריות הצפון-מערביות, וויטהורס ביוקון ואיקלואיט בנונבוט מציעות סיורי זוהר צפוני שמושכים תיירים מכל העולם.

הזמן הטוב ביותר לראות זוהר צפוני הוא מספטמבר עד מרץ, כאשר הלילות ארוכים וחשוכים. אבל זה לא מובטח - הזוהר הצפוני תלוי בפעילות השמש, מזג האוויר ומזל.

יש לילות שבהם השמיים פוצצים בצבעים, כאשר וילונות הזוהר נעים ורוקדים במהירות מדהימה. יש לילות אחרים שבהם מופיע רק קשת ירוקה עדינה. ויש לילות שבהם לא קורה כלום - השמיים נשארים חשוכים ושקטים.

בשנים האחרונות, צילום הזוהר הצפוני הפך לאמנות. צלמים מכל העולם מגיעים לקנדה עם מצלמות מתקדמות כדי ללכוד את הרגעים הקסומים. התמונות שלהם בורות מדיה חברתית ומעוררות השראה מיליוני אנשים.

אבל אין שום תמונה שיכולה להשוות לחוויה האמיתית. לעמוד בקור של מינוס 30 מעלות, להסתכל למעלה ולראות את השמיים נדלקים בצבעים - זה רגש שקשה לתאר במילים. זה רגע שבו אתה מרגיש קטן מול הגדולה של היקום, אבל גם מחובר למשהו קסום ויפה.

הזוהר הצפוני הוא אחד הדברים שהופכים את החורף הקנדי לא רק לעונה שצריך לשרוד, אלא לעונה שצריך לחגוג. זה מזכיר לנו שהטבע מלא בהפתעות, וש그ם במקומות הכי קרים ומבודדים בעולם, יש יופי שלא ייתכן.

בכל פעם שהזוהר הצפוני מופיע בשמי קנדה, זה כמו מתנת מהטבע - תזכורת למדינה ולעולם שיש דברים שהמדע יכול להסביר, אבל הקסם שלהם נשאר נצחי.`,
        category: 'nature',
        difficulty: 'expert'
    }
];

// Dictionary of Canadian Terms - מורחב עם תרגומים לעברית
const DICTIONARY = {
    'poutine / פוטין': 'מנה קנדית המורכבת מצ\'יפס, גבינת קורד וגרווי (רוטב חום מבושל)',
    'toonie / טוני': 'מטבע של 2 דולר קנדי, נקרא כך בגלל הציור של דובים קוטביים',
    'loonie / לוני': 'מטבע של דולר קנדי אחד עם ציור של לון (עוף מים)',
    'mountie / מאונטי': 'שוטר במשטרה המלכותית הקנדית (RCMP) - נקרא כך בגלל רכיבה על סוסים',
    'toque / טוק': 'כובע צמר קנדי חם לחורף, חלק מהלבוש הקנדי הקלסי',
    'double-double / דאבל-דאבל': 'קפה עם 2 כפיות סוכר ו-2 כפיות חלב מטים הורטונס',
    'eh / א': 'מילת שאלה קנדית אופיינית המוספת לסוף משפטים',
    'hoser / הוזר': 'כינוי לקנדי טיפוסי (לא בהכרח מחמיא) - מהמילה "hose" (צינור)',
    'chinook / צ\'ינוק': 'רוח חמה וחזקה בחורף הפושטת שלג באלברטה',
    'inukshuk / אינוקשוק': 'ציון דרך מאבנים מסורתי של האינואיטים',
    'bannock / באנוק': 'לחם מסורתי של העמים הילידיים שהפך קנדי',
    'chesterfield / צ\'סטרפילד': 'שם קנדי לסופה או לכורסת ישיבה',
    'runners / רנרס': 'נחוי קנדי לנעלי ספורט',
    'washroom / ווש-רום': 'השם הקנדי לשירותים (במקום bathroom או restroom)',
    'parkade / פרקייד': 'בית חנייה מקורה (שם ייחודי לקנדה)',
    'serviette / סרבייט': 'מפית (השפעה צרפתית בקנדה)',
    'hydro / הידרו': 'חברת החשמל בקנדה (מהיסטוריה של ייצור חשמל ממים)',
    'mickey / מיקי': 'בקבוק אלכוהול קטן של 375ml',
    'two-four / טו-פור': 'חבילה של 24 בקבוקי בירה',
    'fire hall / פייר הול': 'תחנת כיבוי אש (במקום fire station)',
    'pencil crayon / פנסיל קרייון': 'עיפרון צבעוני (במקום colored pencil)',
    'homo milk / הומו מילק': 'חלב מלא (הומוגניזציה)',
    'keener / קינר': 'אדם שמתאמץ יותר מדי, \"חנון\"',
    'rink rat / רינק רט': 'ילד שמבלה הכל זמנו במגרש הקרח',
    'snowbird / סנואו-בירד': 'קנדי מבוגר שנוסע לדרום בחורף',
    'cottage country / קוטג\' קאנטרי': 'אזור הבקתות הקיציות צפונית לטורונטו'
};

// Load questions database
async function loadQuestionsDatabase() {
    try {
        const response = await fetch('./questions.json');
        QUESTIONS_DATABASE = await response.json();
        console.log('Questions database loaded successfully');
    } catch (error) {
        console.error('Failed to load questions database:', error);
        // Fallback to embedded questions if JSON file fails to load
        QUESTIONS_DATABASE = {
            geography: {
                junior: [
                    {
                        question: "מהי בירת קנדה?",
                        options: ["טורונטו", "מונטריאול", "אוטווה", "ונקובר"],
                        correct: 2,
                        explanation: "אוטווה היא בירת קנדה ונמצאת במחוז אונטריו."
                    }
                ],
                expert: [
                    {
                        question: "איזו עיר מכונה 'עיר הגיר' בקנדה?",
                        options: ["קינגסטון", "קוויבק סיטי", "האליפקס", "ויניפג"],
                        correct: 0,
                        explanation: "קינגסטון מכונה 'עיר הגיר' בגלל בניינים מאבן גיר מקומית."
                    }
                ]
            }
        };
    }
}

// Game initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

async function initializeGame() {
    await loadQuestionsDatabase();
    resetGameState();
    updateUI();
    loadSavedGame();
    setupEventListeners();
    console.log('Hebrew Trivia Tower Enhanced Edition initialized!');
}

function resetGameState() {
    gameState = {
        isPlaying: false,
        isPaused: false,
        gameMode: 'single',
        currentPlayer: 0,
        players: [
            { name: 'שחקן 1', score: 0, tower: [], categoryCount: { geography: 0, history: 0, culture: 0, science: 0, sport: 0, food: 0, nature: 0, celebrities: 0, indigenous: 0 } }
        ],
        currentCard: null,
        selectedDifficulty: null,
        deck: [],
        timer: null,
        timeLeft: 30,
        questionsAnswered: 0,
        gameStartTime: null,
        selectedAnswer: null,
        usedQuestions: new Set(),
        learningMode: {
            wrongAnswers: [],
            reviewMode: false
        },
        stories: [...STORIES_DATABASE],
        dictionary: {...DICTIONARY},
        currentStory: null
    };
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (gameState.isPlaying && gameState.selectedDifficulty && gameState.selectedAnswer === null) {
            if (e.key >= '1' && e.key <= '4') {
                selectAnswer(parseInt(e.key) - 1);
                e.preventDefault();
            }
        }
    });
}

function setGameMode(mode) {
    // Remove active class from all mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected mode button
    const modeButtons = document.querySelectorAll('.mode-btn');
    const modeIndex = ['single', 'multiplayer', 'learning', 'stories', 'dictionary'].indexOf(mode);
    if (modeIndex !== -1 && modeButtons[modeIndex]) {
        modeButtons[modeIndex].classList.add('active');
    }
    
    gameState.gameMode = mode;
    
    switch(mode) {
        case 'single':
            setupSinglePlayer();
            break;
        case 'multiplayer':
            setupMultiplayer();
            break;
        case 'learning':
            setupLearningMode();
            break;
        case 'stories':
            showStories();
            break;
        case 'dictionary':
            showDictionary();
            break;
    }
    
    updateUI();
}

function setupSinglePlayer() {
    gameState.players = [
        { name: 'שחקן 1', score: 0, tower: [], categoryCount: { geography: 0, history: 0, culture: 0, science: 0, sport: 0, food: 0, nature: 0, celebrities: 0, indigenous: 0 } }
    ];
    gameState.currentPlayer = 0;
    
    // Clear all tower displays
    document.querySelectorAll('.tower-cards').forEach(container => {
        container.innerHTML = '';
    });
}

function setupMultiplayer() {
    const numPlayers = parseInt(prompt('כמה שחקנים? (2-4)', '2'));
    if (numPlayers < 2 || numPlayers > 4 || isNaN(numPlayers)) {
        alert('מספר שחקנים לא תקין. חזור למצב שחקן יחיד.');
        setGameMode('single');
        return;
    }
    
    gameState.players = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = prompt(`שם שחקן ${i + 1}:`, `שחקן ${i + 1}`);
        gameState.players.push({
            name: name || `שחקן ${i + 1}`,
            score: 0,
            tower: [],
            categoryCount: { geography: 0, history: 0, culture: 0, science: 0, sport: 0, food: 0, nature: 0, celebrities: 0, indigenous: 0 }
        });
    }
    gameState.currentPlayer = 0;
    
    // Setup individual towers for each player
    setupMultiplayerTowers();
}

function setupMultiplayerTowers() {
    const towerSection = document.querySelector('.tower-section');
    towerSection.innerHTML = '';
    
    // Create a tower for each player
    gameState.players.forEach((player, index) => {
        const playerTowerContainer = document.createElement('div');
        playerTowerContainer.className = 'player-tower-container';
        playerTowerContainer.innerHTML = `
            <h3 class="player-tower-title ${index === gameState.currentPlayer ? 'active-player' : ''}">${player.name}</h3>
            <div class="tower-container">
                <div class="tower-base">
                    <span>🏗️ בסיס המגדל</span>
                </div>
                <div class="tower-cards" id="tower-cards-${index}">
                    <!-- Cards will be built from top to bottom -->
                </div>
            </div>
        `;
        
        towerSection.appendChild(playerTowerContainer);
    });
}

function setupLearningMode() {
    gameState.learningMode.reviewMode = true;
    if (gameState.learningMode.wrongAnswers.length === 0) {
        alert('אין שאלות לחזרה. שחק תחילה במצב רגיל כדי לאסוף שאלות לחזרה.');
        setGameMode('single');
        return;
    }
    gameState.deck = [...gameState.learningMode.wrongAnswers];
}

function startGame() {
    if (gameState.gameMode === 'stories') {
        showStories();
        return;
    }
    
    if (gameState.gameMode === 'dictionary') {
        showDictionary();
        return;
    }
    
    gameState.isPlaying = true;
    gameState.gameStartTime = Date.now();
    
    if (gameState.gameMode !== 'learning') {
        createBalancedDeck();
        shuffleDeck();
    }
    
    drawCard();
    updateUI();
    updateButtonStates();
    saveGame();
}

function createBalancedDeck() {
    gameState.deck = [];
    gameState.usedQuestions.clear();
    
    const categories = Object.keys(QUESTIONS_DATABASE);
    const difficulties = ['junior', 'expert'];
    
    categories.forEach(category => {
        difficulties.forEach(difficulty => {
            const questions = QUESTIONS_DATABASE[category]?.[difficulty] || [];
            
            questions.forEach((questionData, index) => {
                const questionId = `${category}_${difficulty}_${index}`;
                
                if (gameState.usedQuestions.has(questionId)) return;
                
                if (!questionData.question || !questionData.options || 
                    !Array.isArray(questionData.options) || 
                    questionData.options.length !== 4 || 
                    typeof questionData.correct !== 'number' ||
                    questionData.correct < 0 || questionData.correct > 3) {
                    return;
                }
                
                gameState.deck.push({
                    id: questionId,
                    category: category,
                    difficulty: difficulty,
                    question: questionData.question,
                    options: [...questionData.options],
                    correct: questionData.correct,
                    explanation: questionData.explanation || 'אין הסבר זמין'
                });
                
                gameState.usedQuestions.add(questionId);
            });
        });
    });
    
    console.log(`Created deck with ${gameState.deck.length} cards`);
}

function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

function drawCard() {
    if (gameState.deck.length === 0) {
        endGame('gameWon', 'כל הכבוד! סיימת את כל השאלות!');
        return;
    }
    
    gameState.currentCard = gameState.deck.pop();
    gameState.selectedAnswer = null;
    
    if (!gameState.currentCard || !gameState.currentCard.question || !gameState.currentCard.options) {
        if (gameState.deck.length > 0) {
            drawCard();
            return;
        } else {
            endGame('error', 'שגיאה בטעינת השאלות!');
            return;
        }
    }
    
    displayCurrentCard();
    showDifficultySelection();
}

function displayCurrentCard() {
    const categoryNames = {
        geography: '🌍 גיאוגרפיה',
        history: '📚 היסטוריה', 
        culture: '🎨 תרבות',
        science: '🔬 מדע',
        sport: '⚽ ספורט',
        food: '🍁 אוכל',
        nature: '🌲 טבע',
        celebrities: '⭐ מפורסמים',
        indigenous: '🪶 עמים ילידיים'
    };
    
    document.getElementById('card-category').textContent = categoryNames[gameState.currentCard.category];
    document.getElementById('card-question').textContent = 'בחר רמת קושי כדי לראות את השאלה';
}

function selectDifficulty(difficulty) {
    gameState.selectedDifficulty = difficulty;
    gameState.selectedAnswer = null;
    
    document.getElementById('difficulty-selector').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    
    const difficultyText = difficulty === 'junior' ? 'רמה קלה' : 'רמה קשה';
    document.getElementById('question-title').textContent = difficultyText;
    document.getElementById('question-text').textContent = gameState.currentCard.question;
    
    displayAnswerOptions();
    startTimer();
}

function displayAnswerOptions() {
    const options = gameState.currentCard.options;
    
    for (let i = 0; i < 4; i++) {
        const optionBtn = document.getElementById(`option-${i}`);
        if (optionBtn && options[i]) {
            optionBtn.textContent = options[i];
            optionBtn.className = 'option-btn';
            optionBtn.disabled = false;
        }
    }
}

function selectAnswer(answerIndex) {
    if (!gameState.isPlaying || gameState.selectedAnswer !== null || !gameState.currentCard) return;
    
    gameState.selectedAnswer = answerIndex;
    
    document.querySelectorAll('.option-btn').forEach((btn, index) => {
        if (index === answerIndex) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    setTimeout(() => {
        submitAnswer();
    }, 800);
}

function startTimer() {
    gameState.timeLeft = 30;
    updateTimer();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimer();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            gameState.timer = null;
            gameState.selectedAnswer = null; 
            submitAnswer();
        }
    }, 1000);
}

function updateTimer() {
    const timerText = document.getElementById('timer-text');
    const timerFill = document.getElementById('timer-fill');
    
    if (timerText) timerText.textContent = gameState.timeLeft;
    
    const percentage = (gameState.timeLeft / 30) * 100;
    if (timerFill) timerFill.style.width = percentage + '%';
    
    // Change color as time runs out
    if (timerFill) {
        if (percentage > 66) {
            timerFill.style.backgroundColor = 'var(--success-color)';
        } else if (percentage > 33) {
            timerFill.style.backgroundColor = 'var(--warning-color)';
        } else {
            timerFill.style.backgroundColor = 'var(--error-color)';
        }
    }
}

function submitAnswer() {
    if (!gameState.isPlaying || !gameState.currentCard) return;
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    const userAnswerIndex = gameState.selectedAnswer;
    const correctAnswerIndex = gameState.currentCard.correct;
    const isCorrect = userAnswerIndex !== null && userAnswerIndex === correctAnswerIndex;
    
    gameState.questionsAnswered++;
    
    showAnswerFeedback(userAnswerIndex, correctAnswerIndex, isCorrect);
    
    let correctAnswerText = gameState.currentCard.options[correctAnswerIndex] || 'לא זמין';
    
    setTimeout(() => {
        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
            // Add to learning mode for review
            if (gameState.gameMode !== 'learning') {
                gameState.learningMode.wrongAnswers.push(gameState.currentCard);
            }
        }
        
        showFeedback(isCorrect, correctAnswerText);
        updateUI();
        saveGame();
    }, 1500);
}

function showAnswerFeedback(userAnswerIndex, correctAnswerIndex, isCorrect) {
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach((btn, index) => {
        btn.disabled = true;
        btn.classList.remove('selected');
        
        if (index === correctAnswerIndex) {
            btn.classList.add('correct');
        } else if (userAnswerIndex !== null && index === userAnswerIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
}

function handleCorrectAnswer() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    const card = {
        category: gameState.currentCard.category,
        difficulty: gameState.selectedDifficulty,
        question: gameState.currentCard.question.substring(0, 50) + '...'
    };
    
    // Build tower from top to bottom - add to end of array
    currentPlayer.tower.push(card);
    currentPlayer.categoryCount[gameState.currentCard.category]++;
    
    const points = gameState.selectedDifficulty === 'expert' ? 10 : 5;
    currentPlayer.score += points;
    
    addCardToTowerDisplay(card, gameState.currentPlayer);
    
    if (currentPlayer.tower.length >= 10) {
        if (checkWinConditions()) {
            endGame('victory', `${currentPlayer.name} ניצח! בנה מגדל של 10 כרטיסים!`);
            return;
        }
    }
    
    // Switch to next player in multiplayer
    if (gameState.gameMode === 'multiplayer') {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
        updateMultiplayerActivePlayer();
    }
}

function handleWrongAnswer() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    const cardsToRemove = gameState.selectedDifficulty === 'expert' ? 2 : 1;
    
    for (let i = 0; i < cardsToRemove && currentPlayer.tower.length > 0; i++) {
        const removedCard = currentPlayer.tower.pop(); // Remove from top
        if (removedCard && removedCard.category) {
            currentPlayer.categoryCount[removedCard.category]--;
        }
        removeCardFromTowerDisplay(gameState.currentPlayer);
    }
    
    if (currentPlayer.tower.length === 0 && gameState.questionsAnswered > 3) {
        endGame('defeat', `מגדל של ${currentPlayer.name} קרס!`);
        return;
    }
    
    // Switch to next player in multiplayer
    if (gameState.gameMode === 'multiplayer') {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
        updateMultiplayerActivePlayer();
    }
}

function addCardToTowerDisplay(card, playerIndex = 0) {
    let towerCardsContainer;
    
    if (gameState.gameMode === 'multiplayer') {
        towerCardsContainer = document.getElementById(`tower-cards-${playerIndex}`);
    } else {
        towerCardsContainer = document.getElementById('tower-cards');
    }
    
    if (!towerCardsContainer) return;
    
    const cardElement = document.createElement('div');
    cardElement.className = `tower-card ${card.category}`;
    cardElement.innerHTML = `
        <div class="card-content">
            <span class="card-category-icon">${getCategoryIcon(card.category)}</span>
            <span class="card-question-text">${card.question}</span>
            <span class="card-difficulty-badge">${card.difficulty === 'expert' ? 'קשה' : 'קל'}</span>
        </div>
    `;
    
    // Add at the top (newest card at top)
    towerCardsContainer.appendChild(cardElement);
}

function removeCardFromTowerDisplay(playerIndex = 0) {
    let towerCardsContainer;
    
    if (gameState.gameMode === 'multiplayer') {
        towerCardsContainer = document.getElementById(`tower-cards-${playerIndex}`);
    } else {
        towerCardsContainer = document.getElementById('tower-cards');
    }
    
    if (!towerCardsContainer) return;
    
    const lastCard = towerCardsContainer.lastElementChild;
    
    if (lastCard) {
        lastCard.classList.add('fall');
        setTimeout(() => {
            if (lastCard.parentNode) {
                lastCard.parentNode.removeChild(lastCard);
            }
        }, 800);
    }
}

function updateMultiplayerActivePlayer() {
    // Update active player highlighting
    document.querySelectorAll('.player-tower-title').forEach((title, index) => {
        if (index === gameState.currentPlayer) {
            title.classList.add('active-player');
        } else {
            title.classList.remove('active-player');
        }
    });
}

function getCategoryIcon(category) {
    const icons = {
        geography: '🌍',
        history: '📚',
        culture: '🎨',
        science: '🔬',
        sport: '⚽',
        food: '🍁',
        nature: '🌲',
        celebrities: '⭐',
        indigenous: '🪶'
    };
    return icons[category] || '❓';
}

function checkWinConditions() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    return currentPlayer.tower.length >= 10;
}

function showFeedback(isCorrect, correctAnswer) {
    const title = isCorrect ? '✅ תשובה נכונה!' : '❌ תשובה שגויה';
    const message = isCorrect ? 
        'כל הכבוד! הכרטיס נוסף למגדל.' : 
        `התשובה הנכונה היא: ${correctAnswer}`;
    
    document.getElementById('feedback-title').textContent = title;
    document.getElementById('feedback-text').textContent = message;
    
    const explanation = gameState.currentCard?.explanation || 'אין הסבר זמין';
    document.getElementById('feedback-explanation').textContent = explanation;
    
    const modal = document.getElementById('feedback-modal');
    modal.style.display = 'block';
}

function closeFeedback() {
    document.getElementById('feedback-modal').style.display = 'none';
    
    if (gameState.isPlaying) {
        drawCard();
    }
}

function showStories() {
    const storiesModal = document.getElementById('stories-modal');
    const storiesList = document.getElementById('stories-list');
    
    storiesList.innerHTML = '';
    
    gameState.stories.forEach(story => {
        const storyElement = document.createElement('div');
        storyElement.className = 'story-item';
        storyElement.innerHTML = `
            <h3>${story.title}</h3>
            <p class="story-category">${getCategoryName(story.category)} - ${story.difficulty === 'expert' ? 'מתקדם' : 'בסיסי'}</p>
            <button onclick="readStory('${story.id}')">קרא את הסיפור</button>
        `;
        storiesList.appendChild(storyElement);
    });
    
    storiesModal.style.display = 'block';
}

function readStory(storyId) {
    const story = gameState.stories.find(s => s.id === storyId);
    if (!story) return;
    
    gameState.currentStory = story;
    document.getElementById('story-title').textContent = story.title;
    document.getElementById('story-content').textContent = story.content;
    document.getElementById('story-reader-modal').style.display = 'block';
}

function showDictionary() {
    const dictionaryModal = document.getElementById('dictionary-modal');
    const dictionaryList = document.getElementById('dictionary-list');
    
    dictionaryList.innerHTML = '';
    
    Object.entries(gameState.dictionary).forEach(([term, definition]) => {
        const termElement = document.createElement('div');
        termElement.className = 'dictionary-item';
        termElement.innerHTML = `
            <h3>${term}</h3>
            <p>${definition}</p>
        `;
        dictionaryList.appendChild(termElement);
    });
    
    dictionaryModal.style.display = 'block';
}

function getCategoryName(category) {
    const names = {
        geography: 'גיאוגרפיה',
        history: 'היסטוריה',
        culture: 'תרבות',
        science: 'מדע',
        sport: 'ספורט',
        food: 'אוכל',
        nature: 'טבע',
        celebrities: 'מפורסמים',
        indigenous: 'עמים ילידיים'
    };
    return names[category] || category;
}

function endGame(result, message) {
    gameState.isPlaying = false;
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    document.getElementById('game-over-title').textContent = result === 'victory' ? '🏆 ניצחון!' : '😞 המשחק הסתיים';
    document.getElementById('game-over-content').innerHTML = `<p>${message}</p>`;
    document.getElementById('game-over-modal').style.display = 'block';
    
    updateButtonStates();
}

function updateUI() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    document.getElementById('current-player').textContent = currentPlayer.name;
    document.getElementById('tower-height').textContent = currentPlayer.tower.length;
    document.getElementById('current-score').textContent = currentPlayer.score;
    document.getElementById('cards-remaining').textContent = gameState.deck.length;
    
    updateCategoryProgress();
    updatePlayersDisplay();
}

function updateCategoryProgress() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const categories = Object.keys(currentPlayer.categoryCount);
    
    categories.forEach(category => {
        const count = currentPlayer.categoryCount[category];
        const countElement = document.getElementById(`${category}-count`);
        const progressElement = document.getElementById(`${category}-progress`);
        
        if (countElement) countElement.textContent = count;
        if (progressElement) {
            const percentage = Math.min((count / 3) * 100, 100);
            progressElement.style.width = percentage + '%';
        }
    });
}

function updatePlayersDisplay() {
    const playersContainer = document.getElementById('players-container');
    if (!playersContainer) return;
    
    playersContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerElement = document.createElement('div');
        playerElement.className = `player-info ${index === gameState.currentPlayer ? 'active' : ''}`;
        playerElement.innerHTML = `
            <h4>${player.name}</h4>
            <p>ניקוד: ${player.score}</p>
            <p>מגדל: ${player.tower.length}</p>
        `;
        playersContainer.appendChild(playerElement);
    });
}

function updateButtonStates() {
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    if (startBtn && pauseBtn) {
        if (gameState.isPlaying) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        } else {
            startBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveGame() {
    try {
        localStorage.setItem('hebrewTriviaGameState', JSON.stringify(gameState));
    } catch (e) {
        console.warn('Could not save game state:', e);
    }
}

function loadSavedGame() {
    try {
        const saved = localStorage.getItem('hebrewTriviaGameState');
        if (saved) {
            const savedState = JSON.parse(saved);
            if (savedState.isPlaying && confirm('נמצא משחק שמור. האם ברצונך להמשיך?')) {
                gameState = { ...gameState, ...savedState };
                gameState.timer = null;
                updateUI();
            }
        }
    } catch (e) {
        console.warn('Could not load saved game:', e);
    }
}

function showDifficultySelection() {
    document.getElementById('difficulty-selector').style.display = 'block';
    document.getElementById('question-section').style.display = 'none';
}

function resetGame() {
    if (confirm('האם אתה בטוח שברצונך להתחיל משחק חדש?')) {
        resetGameState();
        updateUI();
        updateButtonStates();
        
        // Clear all tower displays
        document.querySelectorAll('.tower-cards').forEach(container => {
            container.innerHTML = '';
        });
        
        localStorage.removeItem('hebrewTriviaGameState');
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('✅ Service Worker registered successfully:', registration.scope);
                
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 New service worker found');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🆕 New content available');
                            if (confirm('גרסה חדשה זמינה! רוצה לרענן?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(function(registrationError) {
                console.log('❌ Service Worker registration failed:', registrationError);
            });
    });
}

// PWA Install Prompt Handler
let deferredPrompt;
let installButton;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 PWA install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

function showInstallButton() {
    console.log('👆 Showing install button');
    if (!installButton) {
        installButton = document.createElement('button');
        installButton.textContent = '📱 התקן אפליקציה';
        installButton.className = 'install-btn';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--primary-color, #2563eb);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            z-index: 1000;
            font-family: inherit;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            animation: slideInUp 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        installButton.addEventListener('mouseover', () => {
            installButton.style.transform = 'scale(1.05)';
            installButton.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
        });
        
        installButton.addEventListener('mouseout', () => {
            installButton.style.transform = 'scale(1)';
            installButton.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
        });
        
        installButton.addEventListener('click', installApp);
        document.body.appendChild(installButton);
    }
    
    installButton.style.display = 'block';
}

function installApp() {
    console.log('🚀 Install app clicked');
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
            } else {
                console.log('❌ User dismissed the install prompt');
            }
            deferredPrompt = null;
            hideInstallButton();
        });
    } else {
        alert('לצערי, הדפדפן שלך לא תומך בהתקנת PWA אוטומטית.\n\nבכרום: תפריט ⋮ ← "התקן אפליקציה"\nבספארי: כפתור שיתוף ⬆️ ← "הוסף למסך הבית"');
    }
}

function hideInstallButton() {
    if (installButton) {
        installButton.style.animation = 'slideOutDown 0.3s ease forwards';
        setTimeout(() => {
            installButton.style.display = 'none';
        }, 300);
    }
}

window.addEventListener('appinstalled', (evt) => {
    console.log('🎉 App was installed successfully');
    hideInstallButton();
});

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    console.log('📱 App is running in standalone mode');
} else {
    console.log('🌐 App is running in browser mode');
}

// Handle URL parameters for direct mode access
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode && ['single', 'multiplayer', 'learning', 'stories', 'dictionary'].includes(mode)) {
        console.log(`🎯 Auto-setting game mode to: ${mode}`);
        setTimeout(() => {
            setGameMode(mode);
        }, 500);
    }
});

console.log('🏗️ Hebrew Trivia Tower Enhanced Edition loaded successfully!');