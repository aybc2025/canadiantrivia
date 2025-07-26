// משתני המשחק הגלובליים
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
    spinResult: null,
    cities: [
        { id: 'ottawa', name: 'אוטווה', province: 'אוטווה', x: 75, y: 65, isStart: true },
        { id: 'toronto', name: 'טורונטו', province: 'אונטריו', x: 72, y: 68 },
        { id: 'montreal', name: 'מונטריאול', province: 'קוויבק', x: 78, y: 62 },
        { id: 'vancouver', name: 'ונקובר', province: 'קולומביה הבריטית', x: 15, y: 55 },
        { id: 'calgary', name: 'קלגרי', province: 'אלברטה', x: 35, y: 58 },
        { id: 'winnipeg', name: 'וויניפג', province: 'מניטובה', x: 55, y: 62 },
        { id: 'halifax', name: 'הליפקס', province: 'נובא סקוטיה', x: 88, y: 68 },
        { id: 'charlottetown', name: 'שארלוטטאון', province: 'אי הנסיך אדוארד', x: 85, y: 65 },
        { id: 'fredericton', name: 'פרדריקטון', province: 'ניו ברנזוויק', x: 82, y: 67 },
        { id: 'stjohns', name: 'סנט ג\'ונס', province: 'ניופאונדלנד ולברדור', x: 92, y: 58 },
        { id: 'regina', name: 'רג\'ינה', province: 'ססקצ\'ואן', x: 45, y: 65 },
        { id: 'whitehorse', name: 'ווייטהורס', province: 'יוקון', x: 10, y: 25 },
        { id: 'yellowknife', name: 'ילונייף', province: 'הטריטוריות הצפון-מערביות', x: 35, y: 35 }
    ]
};

// בנק שאלות מורחב מקורות מהימנים
const questionBank = {
    geography: {
        expert: [
            {
                question: "מהי הבירה של קולומביה הבריטית?",
                answers: ["ונקובר", "ויקטוריה", "קלגרי", "טורונטו"],
                correct: 1,
                fact: "ויקטוריה היא הבירה של קולומביה הבריטית, אך ונקובר היא העיר הגדולה ביותר במחוז."
            },
            {
                question: "איזה מחוז קנדי הוא הגדול ביותר בשטח?",
                answers: ["אונטריו", "קוויבק", "קולומביה הבריטית", "אלברטה"],
                correct: 1,
                fact: "קוויבק הוא המחוז הגדול ביותר בקנדה, עם שטח של יותר מ-1.5 מיליון קמ\"ר."
            },
            {
                question: "איזה אוקיינוס נמצא ממזרח לקנדה?",
                answers: ["האוקיינוס השקט", "האוקיינוס הארקטי", "האוקיינוס האטלנטי", "האוקיינוס ההודי"],
                correct: 2,
                fact: "האוקיינוס האטלנטי נמצא ממזרח לקנדה, והמחוזות הימיים גובלים בו."
            },
            {
                question: "מהו הנהר הארוך ביותר בקנדה?",
                answers: ["נהר האסקצ'ואן", "נהר מקנזי", "נהר סנט לורנס", "נהר אוטווה"],
                correct: 1,
                fact: "נהר מקנזי הוא הנהר הארוך ביותר בקנדה, באורך של 4,241 קילומטר."
            },
            {
                question: "איזה מחוז מכונה 'מחוז הערבה'?",
                answers: ["אלברטה", "ססקצ'ואן", "מניטובה", "אונטריו"],
                correct: 1,
                fact: "ססקצ'ואן מכונה 'מחוז הערבה' בזכות השטחים החקלאיים הנרחבים שלו."
            },
            {
                question: "מהי הבירה של הטריטוריות הצפון-מערביות?",
                answers: ["ילונייף", "ווייטהורס", "איקלואיט", "וויניפג"],
                correct: 0,
                fact: "ילונייף היא הבירה של הטריטוריות הצפון-מערביות ומכונה 'בירת היהלומים של צפון אמריקה'."
            },
            {
                question: "איזה אי הוא הגדול ביותר בקנדה?",
                answers: ["אי ונקובר", "אי בפין", "אי ויקטוריה", "אי הנסיך אדוארד"],
                correct: 1,
                fact: "אי בפין הוא האי הגדול ביותר בקנדה, ואיקלואיט (בירת נונאבוט) נמצאת עליו."
            },
            {
                question: "איזה טריטוריה הוא הצפונית ביותר?",
                answers: ["נונאבוט", "הטריטוריות הצפון-מערביות", "יוקון", "קוויבק"],
                correct: 0,
                fact: "נונאבוט היא הטריטוריה הצפונית ביותר והחדשה ביותר, שהוקמה ב-1999."
            },
            {
                question: "איזה מקום בקנדה תיעד את הטמפרטורה הקרה ביותר אי פעם?",
                answers: ["יוקון", "נונאבוט", "הטריטוריות הצפון-מערביות", "ססקצ'ואן"],
                correct: 0,
                fact: "יוקון החזיק בשיא הטמפרטורה הקרה ביותר בקנדה עם מינוס 63 מעלות צלזיוס."
            },
            {
                question: "באיזה מחוז נמצא הר לוגן, ההר הגבוה ביותר בקנדה?",
                answers: ["קולומביה הבריטית", "אלברטה", "יוקון", "הטריטוריות הצפון-מערביות"],
                correct: 2,
                fact: "הר לוגן נמצא ביוקון, בגובה של 5,959 מטר, והוא נקרא על שם ויליאם לוגן, גיאולוג קנדי מפורסם."
            },
            {
                question: "איזה מפרץ ידוע בגלי הגאות והשפל הגבוהים ביותר בעולם?",
                answers: ["מפרץ הדסון", "מפרץ פאנדי", "מפרץ פרובישר", "מפרץ סנט לורנס"],
                correct: 1,
                fact: "מפרץ פאנדי ידוע בגלי הגאות והשפל הגבוהים ביותר בעולם."
            },
            {
                question: "איזה גשר הוא הארוך ביותר בעולם מעל מים קפואים?",
                answers: ["גשר קונפדרציה", "גשר קוויבק", "גשר הקשת", "גשר הריינבו"],
                correct: 0,
                fact: "גשר קונפדרציה באורך 12.9 קילומטר מחבר בין אי הנסיך אדוארד לניו ברנזוויק."
            },
            {
                question: "איזה גן לאומי הוא הראשון שהוקם בקנדה?",
                answers: ["גן לאומי בנף", "גן לאומי ג'ספר", "גן לאומי אלגונקווין", "גן לאומי יוהו"],
                correct: 0,
                fact: "גן לאומי בנף הוקם ב-1885 והוא הגן הלאומי הראשון בקנדה."
            },
            {
                question: "איזה מחוז מייצר יותר מ-70% מסירופ האדר של העולם?",
                answers: ["אונטריו", "קוויבק", "ניו ברנזוויק", "נובא סקוטיה"],
                correct: 1,
                fact: "קוויבק מייצר יותר מ-70% מסירופ האדר העולמי ומחזיק ברזרבה אסטרטגית."
            },
            {
                question: "איזה קו רוחב עובר בקירוב בגבול בין המחוזות לטריטוריות?",
                answers: ["קו 49", "קו 55", "קו 60", "קו 65"],
                correct: 2,
                fact: "קו רוחב 60 צפון מסמן בקירוב את הגבול בין המחוזות לטריטוריות הקנדיות."
            }
        ],
        junior: [
            {
                question: "מהי הבירה של קנדה?",
                answers: ["טורונטו", "מונטריאול", "אוטווה", "ונקובר"],
                correct: 2,
                fact: "אוטווה היא הבירה של קנדה ונמצאת במחוז אונטריו."
            },
            {
                question: "כמה אוקיינוסים גובלים בקנדה?",
                answers: ["1", "2", "3", "4"],
                correct: 2,
                fact: "שלושה אוקיינוסים גובלים בקנדה: האטלנטי, השקט והארקטי."
            },
            {
                question: "איזה צבע נמצא בדגל קנדה?",
                answers: ["כחול", "ירוק", "אדום", "צהוב"],
                correct: 2,
                fact: "הדגל הקנדי הוא אדום ולבן עם עלה אדר אדום במרכז."
            },
            {
                question: "איזה עלה מופיע על הדגל הקנדי?",
                answers: ["עלה אלון", "עלה אדר", "עלה תאנה", "עלה ליבנה"],
                correct: 1,
                fact: "עלה האדר הוא הסמל הלאומי של קנדה ומופיע על הדגל הלאומי."
            },
            {
                question: "איזו עיר היא הגדולה ביותר בקנדה?",
                answers: ["טורונטו", "מונטריאול", "ונקובר", "קלגרי"],
                correct: 0,
                fact: "טורונטו היא העיר הגדולה ביותר בקנדה עם מעל 2.7 מיליון תושבים."
            },
            {
                question: "איזה מחוז נמצא ממזרח לאונטריו?",
                answers: ["מניטובה", "קוויבק", "אלברטה", "ססקצ'ואן"],
                correct: 1,
                fact: "קוויבק נמצא ממזרח לאונטריו והוא המחוז הצרפתי של קנדה."
            },
            {
                question: "באיזה מחוז נמצאת ונקובר?",
                answers: ["אלברטה", "קולומביה הבריטית", "יוקון", "ססקצ'ואן"],
                correct: 1,
                fact: "ונקובר נמצאת בקולומביה הבריטית ליד האוקיינוס השקט."
            },
            {
                question: "איזה מפל מפורסם נמצא בגבול קנדה וארה\"ב?",
                answers: ["מפלי איגואסו", "מפלי ניאגרה", "מפלי אנג'ל", "מפלי ויקטוריה"],
                correct: 1,
                fact: "מפלי ניאגרה נמצאים בגבול בין קנדה וארה\"ב והם אטרקציה תיירותית מפורסמת."
            },
            {
                question: "איזה חיות מפורסמות חיות בצפון קנדה?",
                answers: ["פינגווינים", "דובי קוטב", "קנגורו", "קרנפים"],
                correct: 1,
                fact: "דובי קוטב חיים בצפון קנדה הארקטי והם סמל של הטבע הקנדי."
            },
            {
                question: "איזה עיר היא הנמל המזרחי ביותר בצפון אמריקה?",
                answers: ["ונקובר", "הליפקס", "קוויבק סיטי", "סנט ג'ונס"],
                correct: 3,
                fact: "סנט ג'ונס בניופאונדלנד הוא הנמל המזרחי ביותר בצפון אמריקה."
            }
        ]
    },
    history: {
        expert: [
            {
                question: "באיזו שנה הוקמה הקונפדרציה הקנדית?",
                answers: ["1865", "1867", "1869", "1871"],
                correct: 1,
                fact: "הקונפדרציה הקנדית הוקמה ב-1 ביולי 1867 כאשר ארבעה מחוזות התאחדו."
            },
            {
                question: "מי היה ראש הממשלה הראשון של קנדה?",
                answers: ["ג'ון א. מקדונלד", "ויילפריד לורייה", "רוברט בורדן", "וויליאם לאיון מקנזי"],
                correct: 0,
                fact: "סר ג'ון א. מקדונלד היה ראש הממשלה הראשון של קנדה מ-1867 עד 1873."
            },
            {
                question: "איזה מלכה בחרה את אוטווה כבירת קנדה?",
                answers: ["המלכה ויקטוריה", "המלכה אליזבת הראשונה", "המלכה אליזבת השנייה", "המלכה מרי"],
                correct: 0,
                fact: "המלכה ויקטוריה בחרה באוטווה כבירת קנדה ב-1857."
            },
            {
                question: "איזה מחוזות היו הראשונים שהתאחדו בקונפדרציה?",
                answers: ["אונטריו, קוויבק, מניטובה, ססקצ'ואן", "אונטריו, קוויבק, נובא סקוטיה, ניו ברנזוויק", "כל המחוזות הנוכחיים", "רק אונטריו וקוויבק"],
                correct: 1,
                fact: "ארבעה מחוזות התאחדו ב-1867: אונטריו, קוויבק, נובא סקוטיה וניו ברנזוויק."
            },
            {
                question: "איזה מסמך יצר את הקונפדרציה הקנדית?",
                answers: ["החוקה הקנדית", "מגילת הזכויות", "חוק צפון אמריקה הבריטית", "הצהרת העצמאות הקנדית"],
                correct: 2,
                fact: "חוק צפון אמריקה הבריטית מ-1867 יצר את הקונפדרציה הקנדית."
            },
            {
                question: "איזה מחוז הצטרף לקנדה ב-1949?",
                answers: ["אי הנסיך אדוארד", "ניופאונדלנד ולברדור", "אלברטה", "ססקצ'ואן"],
                correct: 1,
                fact: "ניופאונדלנד ולברדור היה המחוז האחרון שהצטרף לקנדה ב-1949."
            },
            {
                question: "איזה טריטוריה נוצרה ב-1999?",
                answers: ["יוקון", "הטריטוריות הצפון-מערביות", "נונאבוט", "לברדור"],
                correct: 2,
                fact: "נונאבוט נוצרה ב-1999 והיא הטריטוריה החדשה ביותר בקנדה."
            },
            {
                question: "איזה חברת סחר שלטה בחלק גדול מקנדה לפני הקונפדרציה?",
                answers: ["חברת הודו המזרחית", "חברת מפרץ הדסון", "חברת צפון-מערב", "החברה הצרפתית"],
                correct: 1,
                fact: "חברת מפרץ הדסון שלטה בחלק גדול מקנדה והעבירה את השטחים לממשלת קנדה ב-1870."
            },
            {
                question: "באיזו שנה קיבלה קנדה עצמאות מלאה מבריטניה?",
                answers: ["1867", "1931", "1982", "1967"],
                correct: 2,
                fact: "קנדה קיבלה עצמאות מלאה ב-1982 עם חתימת פייר טרודו על החוקה הקנדית."
            },
            {
                question: "איזה ראש ממשלה קנדי חתם על החוקה הקנדית?",
                answers: ["פייר טרודו", "ג'ון דיפנבייקר", "ליסטר פירסון", "ברייאן מולרוני"],
                correct: 0,
                fact: "פייר טרודו חתם על החוקה הקנדית ב-1982 יחד עם המלכה אליזבת השנייה."
            },
            {
                question: "איזה קרב נחשב לרגע המכונן של הזהות הקנדית במלחמת העולם הראשונה?",
                answers: ["קרב פסח'נדייל", "קרב ויימי רידג'", "קרב סום", "קרב ורדון"],
                correct: 1,
                fact: "קרב ויימי רידג' (1917) נחשב לרגע הלידה הסמלי של הזהות הקנדית."
            },
            {
                question: "איזה ראש ממשלה קנדי זכה בפרס נובל לשלום?",
                answers: ["ליסטר פירסון", "פייר טרודו", "ברייאן מולרוני", "ג'ון דיפנבייקר"],
                correct: 0,
                fact: "ליסטר פירסון זכה בפרס נובל לשלום ב-1957 על פתרון משבר סואץ."
            },
            {
                question: "איזה אירוע כלכלי חשוב התרחש בקנדה בשנות ה-90 של המאה ה-19?",
                answers: ["גילוי נפט באלברטה", "הבהלה לזהב קלונדייק", "בניית מסילת הרכבת הטרנס-קנדית", "השפל הגדול"],
                correct: 1,
                fact: "הבהלה לזהב קלונדייק ביוקון החלה ב-1896 ומשכה אלפי מכורי זהב."
            },
            {
                question: "איזה חוק חשוב נחקק בקנדה ב-1982?",
                answers: ["מגילת הזכויות והחירויות הקנדית", "חוק השפות הרשמיות", "חוק האינדיאנים", "חוק הרב-תרבותיות"],
                correct: 0,
                fact: "מגילת הזכויות והחירויות הקנדית נחקקה ב-1982 כחלק מהחוקה החדשה."
            },
            {
                question: "איזה התקוממות התרחשה בקנדה בשנות ה-30 של המאה ה-19?",
                answers: ["התקוממות מטיס", "מרידות 1837-1838", "התקוממות ריאל", "המלחמה הצרפתית-אינדיאנית"],
                correct: 1,
                fact: "מרידות 1837-1838 באונטריו ובקוויבק דרשו רפורמות דמוקרטיות."
            }
        ],
        junior: [
            {
                question: "איזה חיה מופיעה על המטבע הקנדי?",
                answers: ["דוב", "צבי", "כבשה", "אריה"],
                correct: 1,
                fact: "צבי מופיע על מטבעות קנדיים רבים והוא סמל לקנדה."
            },
            {
                question: "מה שמו של המלך הנוכחי של קנדה?",
                answers: ["המלך צ'ארלס השלישי", "המלכה אליזבת השנייה", "המלך ג'ורג'", "אין מלך לקנדה"],
                correct: 0,
                fact: "המלך צ'ארלס השלישי הוא המלך של קנדה מאז 2022."
            },
            {
                question: "באיזו שנה נוסדה קנדה?",
                answers: ["1867", "1876", "1900", "1945"],
                correct: 0,
                fact: "קנדה נוסדה ב-1867 כאשר ארבעה מחוזות התאחדו."
            },
            {
                question: "איזו מדינה שלטה בקנדה לפני שהפכה עצמאית?",
                answers: ["צרפת", "בריטניה", "ספרד", "הולנד"],
                correct: 1,
                fact: "בריטניה שלטה בקנדה עד שקנדה הפכה עצמאית בהדרגה."
            },
            {
                question: "איך קוראים לאנשים הראשונים שחיו בקנדה?",
                answers: ["קולוניסטים", "מהגרים", "עמים ילידיים", "מתנחלים"],
                correct: 2,
                fact: "העמים הילידיים חיו בקנדה אלפי שנים לפני הגעת האירופים."
            },
            {
                question: "איזה צבע יש לדגל הקנדי החדש שאומץ ב-1965?",
                answers: ["כחול ולבן", "אדום ולבן", "ירוק ולבן", "צהוב ואדום"],
                correct: 1,
                fact: "הדגל הקנדי החדש מ-1965 הוא אדום ולבן עם עלה אדר באמצע."
            },
            {
                question: "איזה יום הוא יום קנדה?",
                answers: ["1 במאי", "4 ביולי", "1 ביולי", "15 באוגוסט"],
                correct: 2,
                fact: "יום קנדה הוא ב-1 ביולי, היום שבו נוסדה הקונפדרציה הקנדית ב-1867."
            },
            {
                question: "איזו שפה דיברו המתנחלים הראשונים בקוויבק?",
                answers: ["אנגלית", "צרפתית", "ספרדית", "הולנדית"],
                correct: 1,
                fact: "המתנחלים הצרפתים דיברו צרפתית, ועד היום קוויבק הוא מחוז צרפתי."
            },
            {
                question: "איך קוראים לשוטרים המפורסמים בסרטים על קנדה?",
                answers: ["רנג'רים", "מאונטיז", "שריפים", "שוטרי עיר"],
                correct: 1,
                fact: "המשטרה הרכובה הקנדית נקראים גם מאונטיז עם המדים האדומים שלהם."
            },
            {
                question: "// משתני המשחק הגלובליים
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
    spinResult: null,
    cities: [
        { id: 'ottawa', name: 'אוטווה', province: 'אוטווה', x: 75, y: 65, isStart: true },
        { id: 'toronto', name: 'טורונטו', province: 'אונטריו', x: 72, y: 68 },
        { id: 'montreal', name: 'מונטריאול', province: 'קוויבק', x: 78, y: 62 },
        { id: 'vancouver', name: 'ונקובר', province: 'קולומביה הבריטית', x: 15, y: 55 },
        { id: 'calgary', name: 'קלגרי', province: 'אלברטה', x: 35, y: 58 },
        { id: 'winnipeg', name: 'וויניפג', province: 'מניטובה', x: 55, y: 62 },
        { id: 'halifax', name: 'הליפקס', province: 'נובא סקוטיה', x: 88, y: 68 },
        { id: 'charlottetown', name: 'שארלוטטאון', province: 'אי הנסיך אדוארד', x: 85, y: 65 },
        { id: 'fredericton', name: 'פרדריקטון', province: 'ניו ברנזוויק', x: 82, y: 67 },
        { id: 'stjohns', name: 'סנט ג\'ונס', province: 'ניופאונדלנד ולברדור', x: 92, y: 58 },
        { id: 'regina', name: 'רג\'ינה', province: 'ססקצ\'ואן', x: 45, y: 65 },
        { id: 'whitehorse', name: 'ווייטהורס', province: 'יוקון', x: 10, y: 25 },
        { id: 'yellowknife', name: 'ילונייף', province: 'הטריטוריות הצפון-מערביות', x: 35, y: 35 }
    ]
};

// בנק שאלות - יטען מקובץ JSON
let questionBank = {};

// קטגוריות הרולטה
const spinnerCategories = [
    { name: 'geography', label: 'גיאוגרפיה', color: '#e74c3c' },
    { name: 'history', label: 'היסטוריה', color: '#3498db' },
    { name: 'general', label: 'כללי', color: '#27ae60' },
    { name: 'arts', label: 'אמנות', color: '#f39c12' },
    { name: 'choice', label: 'בחירה', color: '#9b59b6' },
    { name: 'move', label: 'תזוזה', color: '#34495e' }
];

// אתחול המשחק
document.addEventListener('DOMContentLoaded', function() {
    loadQuestions().then(() => {
        initializeGame();
    }).catch(error => {
        console.warn('לא ניתן לטעון את questions.json, משתמש בשאלות מובנות:', error.message);
        // שימוש בשאלות מובנות כ-fallback
        initializeGame();
    });
});

// טעינת השאלות מקובץ JSON עם fallback לשאלות מובנות
async function loadQuestions() {
    try {
        const response = await fetch('./questions.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const loadedQuestions = await response.json();
        
        // וידוא שהמבנה תקין
        if (loadedQuestions && typeof loadedQuestions === 'object') {
            questionBank = loadedQuestions;
            console.log('השאלות נטענו בהצלחה מקובץ JSON:', 
                Object.keys(questionBank).map(category => 
                    `${category}: ${Object.keys(questionBank[category]).map(level => 
                        `${level} (${questionBank[category][level].length})`
                    ).join(', ')}`
                ).join(' | '));
        } else {
            throw new Error('מבנה JSON לא תקין');
        }
    } catch (error) {
        console.warn('שגיאה בטעינת השאלות מ-JSON:', error);
        // השתמש בשאלות מובנות
        setupFallbackQuestions();
        throw error;
    }
}

// הגדרת שאלות fallback במקרה שלא ניתן לטעון את ה-JSON
function setupFallbackQuestions() {
    questionBank = {
        geography: {
            expert: [
                {
                    question: "מהי הבירה של קולומביה הבריטית?",
                    answers: ["ונקובר", "ויקטוריה", "קלגרי", "טורונטו"],
                    correct: 1,
                    fact: "ויקטוריה היא הבירה של קולומביה הבריטית, אך ונקובר היא העיר הגדולה ביותר במחוז."
                },
                {
                    question: "איזה מחוז קנדי הוא הגדול ביותר בשטח?",
                    answers: ["אונטריו", "קוויבק", "קולומביה הבריטית", "אלברטה"],
                    correct: 1,
                    fact: "קוויבק הוא המחוז הגדול ביותר בקנדה, עם שטח של יותר מ-1.5 מיליון קמ\"ר."
                },
                {
                    question: "איזה אוקיינוס נמצא ממזרח לקנדה?",
                    answers: ["האוקיינוס השקט", "האוקיינוס הארקטי", "האוקיינוס האטלנטי", "האוקיינוס ההודי"],
                    correct: 2,
                    fact: "האוקיינוס האטלנטי נמצא ממזרח לקנדה, והמחוזות הימיים גובלים בו."
                },
                {
                    question: "מהו הנהר הארוך ביותר בקנדה?",
                    answers: ["נהר האסקצ'ואן", "נהר מקנזי", "נהר סנט לורנס", "נהר אוטווה"],
                    correct: 1,
                    fact: "נהר מקנזי הוא הנהר הארוך ביותר בקנדה, באורך של 4,241 קילומטר."
                },
                {
                    question: "איזה מחוז מכונה 'מחוז הערבה'?",
                    answers: ["אלברטה", "ססקצ'ואן", "מניטובה", "אונטריו"],
                    correct: 1,
                    fact: "ססקצ'ואן מכונה 'מחוז הערבה' בזכות השטחים החקלאיים הנרחבים שלו."
                }
            ],
            junior: [
                {
                    question: "מהי הבירה של קנדה?",
                    answers: ["טורונטו", "מונטריאול", "אוטווה", "ונקובר"],
                    correct: 2,
                    fact: "אוטווה היא הבירה של קנדה ונמצאת במחוז אונטריו."
                },
                {
                    question: "כמה אוקיינוסים גובלים בקנדה?",
                    answers: ["1", "2", "3", "4"],
                    correct: 2,
                    fact: "שלושה אוקיינוסים גובלים בקנדה: האטלנטי, השקט והארקטי."
                },
                {
                    question: "איזה צבע נמצא בדגל קנדה?",
                    answers: ["כחול", "ירוק", "אדום", "צהוב"],
                    correct: 2,
                    fact: "הדגל הקנדי הוא אדום ולבן עם עלה אדר אדום במרכז."
                }
            ]
        },
        history: {
            expert: [
                {
                    question: "באיזו שנה הוקמה הקונפדרציה הקנדית?",
                    answers: ["1865", "1867", "1869", "1871"],
                    correct: 1,
                    fact: "הקונפדרציה הקנדית הוקמה ב-1867 כאשר ארבעה מחוזות התאחדו."
                },
                {
                    question: "מי היה ראש הממשלה הראשון של קנדה?",
                    answers: ["ג'ון א. מקדונלד", "ויילפריד לורייה", "רוברט בורדן", "וויליאם לאיון מקנזי"],
                    correct: 0,
                    fact: "סר ג'ון א. מקדונלד היה ראש הממשלה הראשון של קנדה."
                }
            ],
            junior: [
                {
                    question: "איזה חיה מופיעה על המטבע הקנדי?",
                    answers: ["דוב", "צבי", "כבשה", "אריה"],
                    correct: 1,
                    fact: "צבי מופיע על מטבעות קנדיים רבים והוא סמל לקנדה."
                },
                {
                    question: "מה שמו של המלך הנוכחי של קנדה?",
                    answers: ["המלך צ'ארלס השלישי", "המלכה אליזבת השנייה", "המלך ג'ורג'", "אין מלך לקנדה"],
                    correct: 0,
                    fact: "המלך צ'ארלס השלישי הוא המלך של קנדה מאז 2022."
                }
            ]
        },
        general: {
            expert: [
                {
                    question: "מהו הספורט הלאומי של קנדה בחורף?",
                    answers: ["סקי", "החלקה על קרח", "הוקי קרח", "קרלינג"],
                    correct: 2,
                    fact: "הוקי קרח הוא הספורט הלאומי של קנדה בחורף, ולקרוס בקיץ."
                },
                {
                    question: "מהו הפארק הלאומי הראשון של קנדה?",
                    answers: ["פארק בנף", "פארק אלגונקווין", "פארק ג'ספר", "פארק יוהו"],
                    correct: 0,
                    fact: "פארק בנף הוא הפארק הלאומי הראשון של קנדה, שהוקם ב-1885."
                },
                {
                    question: "איזה מאכל קנדי מפורסם עשוי מתפוחי אדמה, גבינה ורוטב?",
                    answers: ["מייפל סירופ", "פוטין", "טורטיר", "נאנמו בר"],
                    correct: 1,
                    fact: "פוטין הוא מאכל קנדי מפורסם שמקורו בקוויבק."
                }
            ],
            junior: [
                {
                    question: "איזה חיה גדולה חיה ביערות קנדה?",
                    answers: ["פיל", "דוב", "אריה", "ג'ירף"],
                    correct: 1,
                    fact: "דובים חיים ביערות קנדה, כולל דובים שחורים ודובי גריזלי."
                },
                {
                    question: "מה הצבע של עלי האדר בסתיו?",
                    answers: ["ירוק", "כחול", "אדום", "סגול"],
                    correct: 2,
                    fact: "עלי האדר הופכים לאדומים יפים בסתיו הקנדי."
                }
            ]
        },
        arts: {
            expert: [
                {
                    question: "מי כתב את השיר הלאומי הקנדי 'או קנדה'?",
                    answers: ["קליקסה לאבליה", "רוברט סטנלי וויר", "אדולף-בזיל רותייה", "כל התשובות נכונות"],
                    correct: 3,
                    fact: "השיר הלאומי נכתב על ידי כמה אנשים: המוסיקה על ידי לאבליה והמילים על ידי רותייה ווויר."
                },
                {
                    question: "איזה צייר קנדי מפורסם בציוריו של נופי קנדה?",
                    answers: ["טום תומסון", "לורן האריס", "A.Y. ג'קסון", "כולם"],
                    correct: 3,
                    fact: "כל אלה היו חברים בקבוצת השבעה - צייירי נוף קנדיים מפורסמים."
                }
            ],
            junior: [
                {
                    question: "איזה סוג מוסיקה מפורסם מקוויבק?",
                    answers: ["רוק", "עממית צרפתית", "קלאסית", "ג'אז"],
                    correct: 1,
                    fact: "מוסיקה עממית צרפתית היא מסורת חשובה בקוויבק."
                }
            ]
        }
    };
    
    console.log('נטענו שאלות fallback מובנות במקום קובץ JSON');
}

function initializeGame() {
    setupEventListeners();
    setupPlayerInputs();
}

function setupEventListeners() {
    document.getElementById('addPlayer').addEventListener('click', addPlayer);
    document.getElementById('startGame').addEventListener('click', startGame);
    document.getElementById('spinButton').addEventListener('click', spinWheel);
    document.getElementById('menuButton').addEventListener('click', showMenu);
    document.getElementById('newGameButton').addEventListener('click', newGame);
    document.getElementById('exitButton').addEventListener('click', exitGame);
    document.getElementById('nextButton').addEventListener('click', nextQuestion);
}

function setupPlayerInputs() {
    // מקמות להוספת שחקנים נוספים
    updateAddPlayerButton();
}

function addPlayer() {
    const playerInputs = document.getElementById('playerInputs');
    const playerCount = playerInputs.children.length + 1;
    
    if (playerCount > 6) {
        alert('מקסימום 6 שחקנים');
        return;
    }
    
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const usedColors = Array.from(document.querySelectorAll('input[type="radio"]:checked'))
        .map(input => input.value);
    const availableColors = colors.filter(color => !usedColors.includes(color));
    
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-input';
    playerDiv.innerHTML = `
        <label>שחקן ${playerCount}:</label>
        <input type="text" id="player${playerCount}Name" placeholder="שם השחקן">
        <select id="player${playerCount}Age">
            <option value="junior">ילד (שאלות קלות)</option>
            <option value="expert">מבוגר (שאלות קשות)</option>
        </select>
        <div class="color-picker">
            ${availableColors.map((color, index) => `
                <input type="radio" name="player${playerCount}Color" value="${color}" id="p${playerCount}${color}" ${index === 0 ? 'checked' : ''}>
                <label for="p${playerCount}${color}" class="color-option ${color}"></label>
            `).join('')}
        </div>
    `;
    
    playerInputs.appendChild(playerDiv);
    updateAddPlayerButton();
}

function updateAddPlayerButton() {
    const playerCount = document.getElementById('playerInputs').children.length;
    const addButton = document.getElementById('addPlayer');
    addButton.style.display = playerCount >= 6 ? 'none' : 'block';
}

function startGame() {
    if (!validatePlayers()) return;
    
    createPlayersFromInputs();
    initializeGameBoard();
    switchToGameScreen();
    startGameLoop();
}

function validatePlayers() {
    const playerInputs = document.querySelectorAll('.player-input');
    
    if (playerInputs.length < 2) {
        alert('נדרשים לפחות 2 שחקנים');
        return false;
    }
    
    for (let input of playerInputs) {
        const nameInput = input.querySelector('input[type="text"]');
        if (!nameInput.value.trim()) {
            alert('אנא מלא את שמות כל השחקנים');
            return false;
        }
    }
    
    return true;
}

function createPlayersFromInputs() {
    gameState.players = [];
    const playerInputs = document.querySelectorAll('.player-input');
    
    playerInputs.forEach((input, index) => {
        const name = input.querySelector('input[type="text"]').value.trim();
        const difficulty = input.querySelector('select').value;
        const color = input.querySelector('input[type="radio"]:checked').value;
        
        gameState.players.push({
            id: index + 1,
            name: name,
            difficulty: difficulty,
            color: color,
            position: 'ottawa', // כולם מתחילים באוטווה
            tokens: [],
            score: 0
        });
    });
}

function initializeGameBoard() {
    createPlayerPawns();
    updatePlayersInfo();
    updateCurrentPlayerDisplay();
}

function createPlayerPawns() {
    const playersContainer = document.getElementById('players');
    playersContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const pawn = document.createElement('div');
        pawn.className = `player-pawn ${player.color}`;
        pawn.id = `pawn-${player.id}`;
        
        // מיקום התחלתי באוטווה
        const startCity = gameState.cities.find(city => city.id === 'ottawa');
        pawn.style.left = `${startCity.x}%`;
        pawn.style.top = `${startCity.y + (index * 2)}%`; // הסטה קלה למניעת חפיפה
        
        playersContainer.appendChild(pawn);
    });
    
    updateCurrentPlayerHighlight();
}

function updatePlayersInfo() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerInfo = document.createElement('div');
        playerInfo.className = `player-info ${index === gameState.currentPlayerIndex ? 'current' : ''}`;
        playerInfo.innerHTML = `
            <div class="player-info-header">
                <div class="player-color-indicator ${player.color}"></div>
                <strong>${player.name}</strong>
            </div>
            <div class="player-tokens">טוקנים: ${player.tokens.length}/5</div>
        `;
        playersList.appendChild(playerInfo);
    });
}

function updateCurrentPlayerDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('currentPlayerName').textContent = currentPlayer.name;
    
    // עדכון טוקנים של השחקן הנוכחי
    const tokensContainer = document.getElementById('currentPlayerTokens');
    tokensContainer.innerHTML = '';
    
    currentPlayer.tokens.forEach(token => {
        const tokenElement = document.createElement('span');
        tokenElement.className = 'token';
        tokenElement.textContent = token;
        tokensContainer.appendChild(tokenElement);
    });
}

function updateCurrentPlayerHighlight() {
    // הסרת הדגשה מכל השחקנים
    document.querySelectorAll('.player-pawn').forEach(pawn => {
        pawn.classList.remove('current');
    });
    
    // הוספת הדגשה לשחקן הנוכחי
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentPawn = document.getElementById(`pawn-${currentPlayer.id}`);
    if (currentPawn) {
        currentPawn.classList.add('current');
    }
}

function switchToGameScreen() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    gameState.gameStarted = true;
}

function startGameLoop() {
    updateCurrentPlayerHighlight();
    enableSpinner();
}

function enableSpinner() {
    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = false;
    spinButton.textContent = 'סובב!';
}

function spinWheel() {
    const spinner = document.getElementById('spinner');
    const spinButton = document.getElementById('spinButton');
    
    spinButton.disabled = true;
    spinButton.textContent = 'מסתובב...';
    
    // סיבוב אקראי
    const spins = Math.random() * 360 + 1440; // לפחות 4 סיבובים מלאים
    spinner.style.transform = `rotate(${spins}deg)`;
    
    setTimeout(() => {
        const result = Math.floor(Math.random() * 6);
        gameState.spinResult = spinnerCategories[result];
        handleSpinResult();
    }, 3000);
}

function handleSpinResult() {
    const result = gameState.spinResult;
    
    if (result.name === 'move') {
        // תזוזה ללא שאלה
        movePlayer(2);
        nextTurn();
    } else if (result.name === 'choice') {
        // בחירת קטגוריה
        showCategoryChoice();
    } else {
        // שאלה רגילה
        showQuestion(result.name);
    }
}

function showCategoryChoice() {
    const categories = ['geography', 'history', 'general', 'arts'];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // סינון קטגוריות לפי קושי
    const availableCategories = categories.filter(cat => {
        return questionBank[cat] && questionBank[cat][currentPlayer.difficulty];
    });
    
    const modal = document.getElementById('questionModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <h3>בחר קטגוריה</h3>
        <div id="categoryButtons">
            ${availableCategories.map(cat => {
                const categoryData = spinnerCategories.find(sc => sc.name === cat);
                return `<button class="answer-button" onclick="selectCategory('${cat}')">${categoryData.label}</button>`;
            }).join('')}
        </div>
    `;
    
    modal.style.display = 'flex';
}

function selectCategory(category) {
    document.getElementById('questionModal').style.display = 'none';
    showQuestion(category);
}

function showQuestion(category) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const questions = questionBank[category][currentPlayer.difficulty];
    
    if (!questions || questions.length === 0) {
        alert('אין שאלות זמינות בקטגוריה זו');
        nextTurn();
        return;
    }
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const modal = document.getElementById('questionModal');
    const categoryElement = document.getElementById('questionCategory');
    const difficultyElement = document.getElementById('questionDifficulty');
    const questionElement = document.getElementById('questionText');
    const answersElement = document.getElementById('questionAnswers');
    const resultElement = document.getElementById('questionResult');
    const nextButton = document.getElementById('nextButton');
    
    // איפוס התצוגה
    resultElement.style.display = 'none';
    nextButton.style.display = 'none';
    
    // הצגת השאלה
    categoryElement.textContent = spinnerCategories.find(sc => sc.name === category).label;
    difficultyElement.textContent = currentPlayer.difficulty === 'expert' ? 'מתקדם' : 'מתחיל';
    questionElement.textContent = randomQuestion.question;
    
    // הצגת תשובות
    answersElement.innerHTML = '';
    randomQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index, randomQuestion);
        answersElement.appendChild(button);
    });
    
    modal.style.display = 'flex';
}

function selectAnswer(selectedIndex, question) {
    const answerButtons = document.querySelectorAll('.answer-button');
    const resultElement = document.getElementById('questionResult');
    const nextButton = document.getElementById('nextButton');
    
    // השבתת כל הכפתורים
    answerButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            button.classList.add('incorrect');
        }
    });
    
    // הצגת התוצאה
    const isCorrect = selectedIndex === question.correct;
    resultElement.className = isCorrect ? 'correct' : 'incorrect';
    resultElement.innerHTML = `
        <div>${isCorrect ? '✅ תשובה נכונה!' : '❌ תשובה לא נכונה'}</div>
        <div style="margin-top: 10px; font-size: 14px;">${question.fact}</div>
    `;
    resultElement.style.display = 'block';
    nextButton.style.display = 'block';
    
    // שמירת התוצאה למשחק
    gameState.lastQuestionResult = isCorrect;
}

function nextQuestion() {
    document.getElementById('questionModal').style.display = 'none';
    
    const isCorrect = gameState.lastQuestionResult;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (isCorrect) {
        currentPlayer.score += 10;
        movePlayer(2); // תזוזה של 2 מקומות
        
        // בדיקה אם השחקן נמצא בעיר שיכול לאסוף בה טוקן
        checkForTokenCollection();
    } else {
        movePlayer(1); // תזוזה של מקום אחד
    }
    
    updatePlayersInfo();
    updateCurrentPlayerDisplay();
    
    // בדיקת ניצחון
    if (currentPlayer.tokens.length >= 5) {
        showWinModal(currentPlayer);
        return;
    }
    
    nextTurn();
}

function movePlayer(steps) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentCityIndex = gameState.cities.findIndex(city => city.id === currentPlayer.position);
    
    // תזוזה במעגל
    const newCityIndex = (currentCityIndex + steps) % gameState.cities.length;
    const newCity = gameState.cities[newCityIndex];
    
    currentPlayer.position = newCity.id;
    
    // עדכון מיקום השחקן על הלוח
    const pawn = document.getElementById(`pawn-${currentPlayer.id}`);
    pawn.style.left = `${newCity.x}%`;
    pawn.style.top = `${newCity.y}%`;
}

function checkForTokenCollection() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentCity = gameState.cities.find(city => city.id === currentPlayer.position);
    
    // בדיקה אם זה לא המקום ההתחלתי ואם השחקן עוד לא אסף את הטוקן
    if (!currentCity.isStart && !currentPlayer.tokens.includes(currentCity.province)) {
        currentPlayer.tokens.push(currentCity.province);
        
        // הודעה על איסוף טוקן
        setTimeout(() => {
            alert(`🎉 אספת טוקן: ${currentCity.province}!`);
        }, 500);
    }
}

function nextTurn() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updateCurrentPlayerDisplay();
    updateCurrentPlayerHighlight();
    updatePlayersInfo();
    enableSpinner();
}

function showWinModal(winner) {
    const modal = document.getElementById('winModal');
    const messageElement = document.getElementById('winMessage');
    
    messageElement.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 20px;">
            השחקן <strong>${winner.name}</strong> ניצח!
        </div>
        <div>אסף ${winner.tokens.length} טוקנים וקיבל ${winner.score} נקודות</div>
        <div style="margin-top: 15px;">הטוקנים שנאספו:</div>
        <div style="margin-top: 10px;">
            ${winner.tokens.map(token => `<span class="token">${token}</span>`).join(' ')}
        </div>
    `;
    
    modal.style.display = 'flex';
}

function showMenu() {
    if (confirm('האם אתה בטוח שאתה רוצה לחזור לתפריט הראשי?')) {
        newGame();
    }
}

function newGame() {
    // איפוס המשחק
    gameState = {
        players: [],
        currentPlayerIndex: 0,
        gameStarted: false,
        spinResult: null,
        cities: gameState.cities // שמירה על נתוני הערים
    };
    
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('winModal').style.display = 'none';
    document.getElementById('questionModal').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    
    // איפוס טפסי השחקנים
    const playerInputs = document.getElementById('playerInputs');
    while (playerInputs.children.length > 2) {
        playerInputs.removeChild(playerInputs.lastChild);
    }
    
    // איפוס שדות הקלט
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    
    updateAddPlayerButton();
}

function exitGame() {
    if (confirm('האם אתה בטוח שאתה רוצה לצאת?')) {
        window.close();
    }
}
