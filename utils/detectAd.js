export function detectAd(text) {
    if (!text) return false;

    const adWords = [
        // Русские
        "продам", "куплю", "цена", "акция", "скидка",
        "доставка", "закажи", "прайс", "аренда", "опт",

        // Казахские
        "сатамын", "сатып аламын", "бағасы", "жеңілдік", "науқан",
        "жеткізу", "тапсырыс бер", "прайс", "жалдау", "көтерме"
    ];

    return adWords.some(word => text.toLowerCase().includes(word));
}
