const paletteLibrary = [
    //Warm & Earthy Tones
    { name: 'Autumn Harvest', colors: ['#FF6B35', '#F7931E', '#FDB833', '#C1272D', '#4A1F1A'] },
    { name: 'Sunset Blaze', colors: ['#FF6B35', '#F45E61', '#FF85A2', '#E94B3C', '#A23B72'] },
    { name: 'Desert Sand', colors: ['#D4A574', '#C2956A', '#8B6D47', '#5C5348', '#3E3B37'] },
    { name: 'Burnt Orange', colors: ['#CC5500', '#FF6B35', '#FFB703', '#FB5607', '#FFBE0B'] },
    { name: 'Rust & Copper', colors: ['#A0522D', '#CD5C5C', '#FF6347', '#FF7F50', '#FFB6C1'] },

    //Cool & Oceanic
    { name: 'Ocean Breeze', colors: ['#0066CC', '#00A4CC', '#00B8CC', '#58C4DC', '#A8DADC'] },
    { name: 'Deep Sea', colors: ['#003366', '#004080', '#0066CC', '#3399FF', '#66CCFF'] },
    { name: 'Arctic Blue', colors: ['#1F4788', '#2E5C8A', '#4A90A4', '#7FB3D5', '#B4D9F0'] },
    { name: 'Teal Dream', colors: ['#008080', '#00A09D', '#20B2AA', '#48D1CC', '#87CEEB'] },
    { name: 'Sapphire', colors: ['#0F52BA', '#0066FF', '#1E90FF', '#4169E1', '#6495ED'] },

    //Vibrant & Bold
    { name: 'Neon Lights', colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'] },
    { name: 'Candy Pop', colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1'] },
    { name: 'Electric Energy', colors: ['#00FF00', '#7FFF00', '#FFFF00', '#FF7F00', '#FF0000'] },
    { name: 'Purple Passion', colors: ['#8B008B', '#BA55D3', '#DA70D6', '#EE82EE', '#FFB6C1'] },
    { name: 'Bright Citrus', colors: ['#FFA500', '#FFD700', '#ADFF2F', '#32CD32', '#00CED1'] },

    //Muted & Sophisticated
    { name: 'Muted Mauve', colors: ['#967BB6', '#B7A6D3', '#C8B8E4', '#D9CAF0', '#E8E0F7'] },
    { name: 'Sage Garden', colors: ['#9CAF88', '#B5D2A2', '#C9E4CA', '#67A1A2', '#8FB4A8'] },
    { name: 'Dusty Rose', colors: ['#A67C7D', '#B08080', '#C9A5A5', '#D4C4C4', '#E8DDD9'] },
    { name: 'Lavender Dream', colors: ['#B19CD9', '#CFCFDF', '#D4A5D4', '#E6D5E8', '#F5EAEA'] },
    { name: 'Soft Sepia', colors: ['#A89066', '#B2956A', '#C0956F', '#CCA876', '#DCC0A8'] },

    //Monochromatic & Grayscale
    { name: 'Classic Grays', colors: ['#2C2C2C', '#4A4A4A', '#696969', '#A9A9A9', '#D3D3D3'] },
    { name: 'Steel Blue', colors: ['#1C1C3C', '#3D4A6B', '#5C6B8C', '#7A8FAD', '#A9BFD4'] },
    { name: 'Charcoal', colors: ['#1F1F1F', '#333333', '#595959', '#808080', '#ADADAD'] },
    { name: 'Platinum', colors: ['#191919', '#363636', '#5C5C5C', '#8A8A8A', '#BEBEBE'] },
    { name: 'Monochrome Black', colors: ['#000000', '#1A1A1A', '#333333', '#4D4D4D', '#808080'] },

    //Pastel & Soft
    { name: 'Pastel Rainbow', colors: ['#FFB3BA', '#FFCCCB', '#FFFFCC', '#BAFFC9', '#BAE1FF'] },
    { name: 'Soft Peach', colors: ['#FFD1DC', '#FFE5E5', '#FFF0E1', '#FFE4D6', '#FFD1B8'] },
    { name: 'Pale Mint', colors: ['#E0F7E0', '#C8F0C8', '#B0E8B0', '#98E098', '#80D880'] },
    { name: 'Sky Blue', colors: ['#ADD8E6', '#B0D8E0', '#B4DCE8', '#B8E0F0', '#C0E8F8'] },
    { name: 'Cotton Candy', colors: ['#FFB3D9', '#FFB8E6', '#FFCCFF', '#E6CCFF', '#CCCCFF'] },

    //Jewel Tones
    { name: 'Emerald Elegance', colors: ['#50C878', '#3D8B7D', '#2D6A4F', '#1B4332', '#40916C'] },
    { name: 'Ruby Red', colors: ['#C41E3A', '#DC143C', '#E63946', '#A4161A', '#9D0208'] },
    { name: 'Amethyst', colors: ['#9932CC', '#BA55D3', '#DA70D6', '#DDA0DD', '#EE82EE'] },
    { name: 'Topaz Gold', colors: ['#D4AF37', '#FFD700', '#FFA500', '#FF8C00', '#FF7F00'] },
    { name: 'Opal Dreams', colors: ['#A9F7D6', '#72DDF7', '#6066CC', '#AD8CDF', '#F7A9CC'] },

    //Nature-Inspired
    { name: 'Forest Floor', colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D'] },
    { name: 'Moss & Stone', colors: ['#6B8E23', '#8FBC8F', '#A4D65E', '#7CB342', '#558B2F'] },
    { name: 'Flower Garden', colors: ['#FF6B6B', '#FFB86C', '#FFE66D', '#95E1D3', '#C7CEEA'] },
    { name: 'Leaf Green', colors: ['#228B22', '#32CD32', '#00FF00', '#90EE90', '#98FB98'] },
    { name: 'Tropical Sunset', colors: ['#FF6B9D', '#FF6B9D', '#FFDE59', '#28A745', '#00BCD4'] },

    //Professional & Business
    { name: 'Corporate Blue', colors: ['#003366', '#0066CC', '#3399FF', '#0099FF', '#CCDDFF'] },
    { name: 'Elegant Black', colors: ['#000000', '#1C1C1C', '#333333', '#4D4D4D', '#FFFFFF'] },
    { name: 'Business Casual', colors: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'] },
    { name: 'Finance Green', colors: ['#1E5631', '#3E8A44', '#6DB75B', '#9EDC8C', '#C8E6C9'] },
    { name: 'Tech Gray', colors: ['#2A2D34', '#3D4149', '#52575D', '#909399', '#C0C7D9'] },

    //Food & Beverage
    { name: 'Coffee Shop', colors: ['#5C4033', '#6F4E37', '#8B7355', '#A0826D', '#C1956B'] },
    { name: 'Candy Store', colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFDAB9'] },
    { name: 'Fresh Juice', colors: ['#FF6347', '#FFB347', '#FFFF00', '#90EE90', '#87CEEB'] },
    { name: 'Chocolate & Cream', colors: ['#3B2F2F', '#86608E', '#D4A5A5', '#F0E6E6', '#FFFFFF'] },
    { name: 'Olive Oil', colors: ['#6B8E23', '#808000', '#A68D5B', '#C0A080', '#E0D5B7'] },

    //Gaming & Entertainment
    { name: 'Game Over Red', colors: ['#FF0000', '#CC0000', '#990000', '#660000', '#330000'] },
    { name: 'Level Up Yellow', colors: ['#FFEB3B', '#FDD835', '#FBC02D', '#F9A825', '#FB8500'] },
    { name: 'Victory Blue', colors: ['#0066FF', '#0099FF', '#00CCFF', '#00FFFF', '#CCFFFF'] },
    { name: 'Adventure Green', colors: ['#00AA00', '#00CC00', '#33FF33', '#66FF66', '#99FF99'] },
    { name: 'Epic Purple', colors: ['#7B00FF', '#9500FF', '#B400FF', '#D000FF', '#FF00FF'] },

    //Romantic & Feminine
    { name: 'Rose Garden', colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1'] },
    { name: 'Girly Pink', colors: ['#FF69B4', '#FF85C0', '#FFA0D2', '#FFC0E0', '#FFE0F0'] },
    { name: 'Romantic Blush', colors: ['#FFB3BA', '#FFCCCB', '#FFE0E6', '#FFF0F5', '#FFFFFF'] },
    { name: 'Mauve Silk', colors: ['#CCAACC', '#D4B5D4', '#DCC0DC', '#E8D0E8', '#F0E0F0'] },
    { name: 'Dreamy Pink', colors: ['#FF89B4', '#FFB8D1', '#FFC9DB', '#FFD6E8', '#FFE4F0'] },

    //Minimalist & Modern
    { name: 'Stark Contrast', colors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'] },
    { name: 'Monochrome White', colors: ['#FFFFFF', '#F0F0F0', '#D3D3D3', '#A9A9A9', '#808080'] },
    { name: 'Minimal Black', colors: ['#000000', '#1A1A1A', '#333333', '#666666', '#FFFFFF'] },
    { name: 'Neutral Beige', colors: ['#D3D3D3', '#C0C0C0', '#A0A0A0', '#696969', '#333333'] },
    { name: 'Simple Gray', colors: ['#F5F5F5', '#E0E0E0', '#BDBDBD', '#757575', '#212121'] },

    //Seasonal
    { name: 'Spring Fresh', colors: ['#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00'] },
    { name: 'Summer Heat', colors: ['#FF0000', '#FF6600', '#FFCC00', '#FF3300', '#FF9900'] },
    { name: 'Fall Colors', colors: ['#FF6B35', '#F7931E', '#FDB833', '#C1272D', '#4A1F1A'] },
    { name: 'Winter Frost', colors: ['#E0FFFF', '#B0E0E6', '#87CEEB', '#4682B4', '#191970'] },
    { name: 'Seasonal Blend', colors: ['#FF6B35', '#4682B4', '#228B22', '#FFD700', '#FF1493'] },

    //Cultural & Iconic
    { name: 'Japanese Sakura', colors: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFEAA7'] },
    { name: 'Indian Spice', colors: ['#FF6B35', '#E63946', '#A4161A', '#370617', '#FFBE0B'] },
    { name: 'Nordic Design', colors: ['#1C1C1C', '#4A4A4A', '#A9A9A9', '#D3D3D3', '#FFFFFF'] },
    { name: 'Mediterranean', colors: ['#FFFFFF', '#0066CC', '#FF6600', '#FFD700', '#32CD32'] },
    { name: 'Tropical Paradise', colors: ['#FF6B9D', '#FFFF99', '#32CD32', '#00BFFF', '#FF8C00'] },

    //Accessibility & Inclusive
    { name: 'Colorblind Friendly', colors: ['#000000', '#E69F00', '#56B4E9', '#009E73', '#F0E442'] },
    { name: 'High Contrast', colors: ['#000000', '#FFFFFF', '#FFFF00', '#FF0000', '#00FFFF'] },
    { name: 'Readable Palette', colors: ['#1A1A1A', '#404040', '#6E6E6E', '#A8A8A8', '#E8E8E8'] },
    { name: 'Soft on Eyes', colors: ['#F5F5F0', '#E8DDD0', '#D4C4B9', '#B29F94', '#8B7D6B'] },
    { name: 'Accessible Blues', colors: ['#003366', '#0052A3', '#0066CC', '#3399FF', '#66CCFF'] },

    // --- NEW STRUCTURED ADDITIONS ---
    
    {
      name: 'Spencer Mansion',
      colors: ['#2A1A12', '#4D3B2E', '#731810', '#8C7A6B', '#111418'],
      category: 'Real-world references',
      tags: ['horror', 'survival', 'mansion', 'dark']
    },
    {
      name: 'Radiant Action',
      colors: ['#FD4556', '#111111', '#ECE8E1', '#53212B', '#FFFBF5'],
      category: 'Real-world references',
      tags: ['fps', 'tactical', 'shooter', 'red']
    },
    {
      name: 'Engine Default',
      colors: ['#3A3A3A', '#222222', '#1E1E1E', '#00A8FF', '#FFFFFF'],
      category: 'Dark mode friendly',
      tags: ['development', 'ui', 'editor', 'unity']
    },
    {
      name: 'Peach Fuzz 2024',
      colors: ['#FFBE98', '#E5A585', '#CC8C72', '#B2735F', '#995A4C'],
      category: 'Trending colors',
      tags: ['pantone', 'trend', 'warm', '2024']
    }
];

function getRandomPalette() {
    const index = Math.floor(Math.random() * paletteLibrary.length);
    return paletteLibrary[index];
}

function getAllPalettes() {
    return paletteLibrary;
}

function getPaletteCount() {
    return paletteLibrary.length;
}
