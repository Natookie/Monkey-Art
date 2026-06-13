const paletteLibrary = [
    //Warm & Earthy Tones
    { name: 'Autumn Harvest', colors: ['#FF6B35', '#F7931E', '#FDB833', '#C1272D', '#4A1F1A'], category: 'warm', tags: ['autumn', 'harvest', 'earthy'] },
    { name: 'Sunset Blaze', colors: ['#FF6B35', '#F45E61', '#FF85A2', '#E94B3C', '#A23B72'], category: 'warm', tags: ['sunset', 'vibrant', 'romantic'] },
    { name: 'Desert Sand', colors: ['#D4A574', '#C2956A', '#8B6D47', '#5C5348', '#3E3B37'], category: 'warm', tags: ['desert', 'neutral', 'earthy'] },
    { name: 'Burnt Orange', colors: ['#CC5500', '#FF6B35', '#FFB703', '#FB5607', '#FFBE0B'], category: 'warm', tags: ['orange', 'vibrant', 'energy'] },
    { name: 'Rust & Copper', colors: ['#A0522D', '#CD5C5C', '#FF6347', '#FF7F50', '#FFB6C1'], category: 'warm', tags: ['rustic', 'metal', 'earthy'] },
    { name: 'Terracotta Dream', colors: ['#E2725B', '#C85A3A', '#B1432A', '#9A3B25', '#7A2E1A'], category: 'warm', tags: ['terracotta', 'clay', 'mediterranean'] },
    { name: 'Golden Hour', colors: ['#FFD700', '#FFC107', '#FFB300', '#FFA000', '#FF8F00'], category: 'warm', tags: ['golden', 'sunset', 'glow'] },
    { name: 'Campfire Glow', colors: ['#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FFDAB9'], category: 'warm', tags: ['fire', 'cozy', 'warmth'] },

    //Cool & Oceanic
    { name: 'Ocean Breeze', colors: ['#0066CC', '#00A4CC', '#00B8CC', '#58C4DC', '#A8DADC'], category: 'cool', tags: ['ocean', 'calm', 'blue'] },
    { name: 'Deep Sea', colors: ['#003366', '#004080', '#0066CC', '#3399FF', '#66CCFF'], category: 'cool', tags: ['deep', 'ocean', 'professional'] },
    { name: 'Arctic Blue', colors: ['#1F4788', '#2E5C8A', '#4A90A4', '#7FB3D5', '#B4D9F0'], category: 'cool', tags: ['arctic', 'cold', 'winter'] },
    { name: 'Teal Dream', colors: ['#008080', '#00A09D', '#20B2AA', '#48D1CC', '#87CEEB'], category: 'cool', tags: ['teal', 'fresh', 'calm'] },
    { name: 'Sapphire', colors: ['#0F52BA', '#0066FF', '#1E90FF', '#4169E1', '#6495ED'], category: 'cool', tags: ['jewel', 'blue', 'luxury'] },
    { name: 'Glacier Ice', colors: ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA'], category: 'cool', tags: ['ice', 'winter', 'fresh'] },
    { name: 'Midnight Blue', colors: ['#0A1128', '#1C2E4A', '#2B4A6B', '#3A6B8C', '#4A8CAD'], category: 'cool', tags: ['night', 'dark', 'mysterious'] },
    { name: 'Lagoon', colors: ['#00BCD4', '#26C6DA', '#4DD0E1', '#80DEEA', '#B2EBF2'], category: 'cool', tags: ['tropical', 'water', 'fresh'] },

    //Vibrant & Bold
    { name: 'Neon Lights', colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'], category: 'vibrant', tags: ['neon', 'cyberpunk', 'energy'] },
    { name: 'Candy Pop', colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1'], category: 'vibrant', tags: ['sweet', 'candy', 'playful'] },
    { name: 'Electric Energy', colors: ['#00FF00', '#7FFF00', '#FFFF00', '#FF7F00', '#FF0000'], category: 'vibrant', tags: ['electric', 'bold', 'warning'] },
    { name: 'Purple Passion', colors: ['#8B008B', '#BA55D3', '#DA70D6', '#EE82EE', '#FFB6C1'], category: 'vibrant', tags: ['purple', 'royal', 'dramatic'] },
    { name: 'Bright Citrus', colors: ['#FFA500', '#FFD700', '#ADFF2F', '#32CD32', '#00CED1'], category: 'vibrant', tags: ['citrus', 'fruity', 'energetic'] },
    { name: 'Cyberpunk 2077', colors: ['#FF0055', '#00FFFF', '#FFFF00', '#FF00FF', '#00FF00'], category: 'vibrant', tags: ['cyberpunk', 'neon', 'future'] },
    { name: 'Vaporwave', colors: ['#FF71CE', '#01CDFE', '#05FFA1', '#B967FF', '#FFFB96'], category: 'vibrant', tags: ['vaporwave', 'retro', 'synthwave'] },
    { name: 'Rainbow Burst', colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF'], category: 'vibrant', tags: ['rainbow', 'pride', 'colorful'] },

    //Muted & Sophisticated
    { name: 'Muted Mauve', colors: ['#967BB6', '#B7A6D3', '#C8B8E4', '#D9CAF0', '#E8E0F7'], category: 'muted', tags: ['mauve', 'elegant', 'soft'] },
    { name: 'Sage Garden', colors: ['#9CAF88', '#B5D2A2', '#C9E4CA', '#67A1A2', '#8FB4A8'], category: 'muted', tags: ['sage', 'garden', 'calm'] },
    { name: 'Dusty Rose', colors: ['#A67C7D', '#B08080', '#C9A5A5', '#D4C4C4', '#E8DDD9'], category: 'muted', tags: ['rose', 'vintage', 'romantic'] },
    { name: 'Lavender Dream', colors: ['#B19CD9', '#CFCFDF', '#D4A5D4', '#E6D5E8', '#F5EAEA'], category: 'muted', tags: ['lavender', 'soft', 'dreamy'] },
    { name: 'Soft Sepia', colors: ['#A89066', '#B2956A', '#C0956F', '#CCA876', '#DCC0A8'], category: 'muted', tags: ['sepia', 'vintage', 'warm'] },
    { name: 'Dusty Blue', colors: ['#7A8B99', '#8DA3B3', '#A0B8C8', '#B3CDDD', '#C6E2F2'], category: 'muted', tags: ['dusty', 'blue', 'calm'] },
    { name: 'Earthy Olive', colors: ['#556B2F', '#6B8E23', '#808000', '#9ACD32', '#BDB76B'], category: 'muted', tags: ['olive', 'military', 'earthy'] },
    { name: 'Powder Pink', colors: ['#FADADD', '#FBC4C4', '#F8B0B0', '#F5A0A0', '#F28B8B'], category: 'muted', tags: ['pink', 'soft', 'gentle'] },

    //Monochromatic & Grayscale
    { name: 'Classic Grays', colors: ['#2C2C2C', '#4A4A4A', '#696969', '#A9A9A9', '#D3D3D3'], category: 'mono', tags: ['gray', 'neutral', 'professional'] },
    { name: 'Steel Blue', colors: ['#1C1C3C', '#3D4A6B', '#5C6B8C', '#7A8FAD', '#A9BFD4'], category: 'mono', tags: ['steel', 'blue-gray', 'corporate'] },
    { name: 'Charcoal', colors: ['#1F1F1F', '#333333', '#595959', '#808080', '#ADADAD'], category: 'mono', tags: ['charcoal', 'dark', 'modern'] },
    { name: 'Platinum', colors: ['#191919', '#363636', '#5C5C5C', '#8A8A8A', '#BEBEBE'], category: 'mono', tags: ['platinum', 'metal', 'luxury'] },
    { name: 'Monochrome Black', colors: ['#000000', '#1A1A1A', '#333333', '#4D4D4D', '#808080'], category: 'mono', tags: ['black', 'monochrome', 'minimal'] },
    { name: 'True White', colors: ['#FFFFFF', '#F5F5F5', '#EEEEEE', '#E0E0E0', '#D0D0D0'], category: 'mono', tags: ['white', 'clean', 'minimal'] },
    { name: 'Graphite', colors: ['#2F4F4F', '#3E5E5E', '#4E6E6E', '#6E8E8E', '#8EAEAE'], category: 'mono', tags: ['graphite', 'dark', 'sleek'] },
    { name: 'Silver Lining', colors: ['#C0C0C0', '#D0D0D0', '#E0E0E0', '#F0F0F0', '#FFFFFF'], category: 'mono', tags: ['silver', 'shiny', 'elegant'] },

    //Pastel & Soft
    { name: 'Pastel Rainbow', colors: ['#FFB3BA', '#FFCCCB', '#FFFFCC', '#BAFFC9', '#BAE1FF'], category: 'pastel', tags: ['pastel', 'rainbow', 'soft'] },
    { name: 'Soft Peach', colors: ['#FFD1DC', '#FFE5E5', '#FFF0E1', '#FFE4D6', '#FFD1B8'], category: 'pastel', tags: ['peach', 'soft', 'warm'] },
    { name: 'Pale Mint', colors: ['#E0F7E0', '#C8F0C8', '#B0E8B0', '#98E098', '#80D880'], category: 'pastel', tags: ['mint', 'fresh', 'calm'] },
    { name: 'Sky Blue', colors: ['#ADD8E6', '#B0D8E0', '#B4DCE8', '#B8E0F0', '#C0E8F8'], category: 'pastel', tags: ['sky', 'blue', 'airy'] },
    { name: 'Cotton Candy', colors: ['#FFB3D9', '#FFB8E6', '#FFCCFF', '#E6CCFF', '#CCCCFF'], category: 'pastel', tags: ['cotton', 'candy', 'sweet'] },
    { name: 'Butter Yellow', colors: ['#FFF5CC', '#FFF2B5', '#FFEE99', '#FFEB80', '#FFE866'], category: 'pastel', tags: ['yellow', 'butter', 'soft'] },
    { name: 'Lilac Mist', colors: ['#E6E6FA', '#D8BFD8', '#DDA0DD', '#EE82EE', '#DA70D6'], category: 'pastel', tags: ['lilac', 'purple', 'soft'] },
    { name: 'Seafoam', colors: ['#D0F0E0', '#B8E8D0', '#A0E0C0', '#88D8B0', '#70D0A0'], category: 'pastel', tags: ['seafoam', 'green', 'calm'] },

    //Jewel Tones
    { name: 'Emerald Elegance', colors: ['#50C878', '#3D8B7D', '#2D6A4F', '#1B4332', '#40916C'], category: 'jewel', tags: ['emerald', 'jewel', 'luxury'] },
    { name: 'Ruby Red', colors: ['#C41E3A', '#DC143C', '#E63946', '#A4161A', '#9D0208'], category: 'jewel', tags: ['ruby', 'red', 'passion'] },
    { name: 'Amethyst', colors: ['#9932CC', '#BA55D3', '#DA70D6', '#DDA0DD', '#EE82EE'], category: 'jewel', tags: ['amethyst', 'purple', 'royal'] },
    { name: 'Topaz Gold', colors: ['#D4AF37', '#FFD700', '#FFA500', '#FF8C00', '#FF7F00'], category: 'jewel', tags: ['topaz', 'gold', 'rich'] },
    { name: 'Opal Dreams', colors: ['#A9F7D6', '#72DDF7', '#6066CC', '#AD8CDF', '#F7A9CC'], category: 'jewel', tags: ['opal', 'iridescent', 'dreamy'] },
    { name: 'Sapphire Blue', colors: ['#0F52BA', '#1E3A8A', '#1E40AF', '#2563EB', '#3B82F6'], category: 'jewel', tags: ['sapphire', 'blue', 'deep'] },
    { name: 'Garnet', colors: ['#8B0000', '#A52A2A', '#B22222', '#DC143C', '#FF0000'], category: 'jewel', tags: ['garnet', 'dark red', 'warm'] },
    { name: 'Citrine', colors: ['#E4C580', '#DDB867', '#D6AA4E', '#CF9D35', '#C8901C'], category: 'jewel', tags: ['citrine', 'yellow', 'warm'] },

    //Nature-Inspired
    { name: 'Forest Floor', colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D'], category: 'nature', tags: ['forest', 'green', 'earthy'] },
    { name: 'Moss & Stone', colors: ['#6B8E23', '#8FBC8F', '#A4D65E', '#7CB342', '#558B2F'], category: 'nature', tags: ['moss', 'stone', 'natural'] },
    { name: 'Flower Garden', colors: ['#FF6B6B', '#FFB86C', '#FFE66D', '#95E1D3', '#C7CEEA'], category: 'nature', tags: ['flowers', 'garden', 'cheerful'] },
    { name: 'Leaf Green', colors: ['#228B22', '#32CD32', '#00FF00', '#90EE90', '#98FB98'], category: 'nature', tags: ['leaf', 'green', 'fresh'] },
    { name: 'Tropical Sunset', colors: ['#FF6B9D', '#FF6B9D', '#FFDE59', '#28A745', '#00BCD4'], category: 'nature', tags: ['tropical', 'sunset', 'vacation'] },
    { name: 'Rainforest', colors: ['#0B5E2E', '#1A7A3A', '#2D9A4E', '#46B87A', '#62D6A6'], category: 'nature', tags: ['rainforest', 'lush', 'green'] },
    { name: 'Desert Dusk', colors: ['#E88C6D', '#D97A5C', '#CA684B', '#BB563A', '#AC4429'], category: 'nature', tags: ['desert', 'dusk', 'warm'] },
    { name: 'Aurora Borealis', colors: ['#00FF87', '#60FFB0', '#A0FFD9', '#00D4FF', '#0099FF'], category: 'nature', tags: ['aurora', 'northern lights', 'magical'] },

    //Professional & Business
    { name: 'Corporate Blue', colors: ['#003366', '#0066CC', '#3399FF', '#0099FF', '#CCDDFF'], category: 'professional', tags: ['corporate', 'blue', 'trust'] },
    { name: 'Elegant Black', colors: ['#000000', '#1C1C1C', '#333333', '#4D4D4D', '#FFFFFF'], category: 'professional', tags: ['black', 'elegant', 'luxury'] },
    { name: 'Business Casual', colors: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'], category: 'professional', tags: ['business', 'neutral', 'calm'] },
    { name: 'Finance Green', colors: ['#1E5631', '#3E8A44', '#6DB75B', '#9EDC8C', '#C8E6C9'], category: 'professional', tags: ['finance', 'green', 'money'] },
    { name: 'Tech Gray', colors: ['#2A2D34', '#3D4149', '#52575D', '#909399', '#C0C7D9'], category: 'professional', tags: ['tech', 'gray', 'modern'] },
    { name: 'Law Firm Navy', colors: ['#0A1172', '#1B2A8A', '#2C43A2', '#3D5CBA', '#4E75D2'], category: 'professional', tags: ['navy', 'law', 'trustworthy'] },
    { name: 'Healthcare Mint', colors: ['#A8E6CF', '#D4F1F9', '#E8F8F5', '#F0FFF0', '#F5FFFA'], category: 'professional', tags: ['healthcare', 'mint', 'clean'] },
    { name: 'Education Orange', colors: ['#FF8C42', '#FFA45C', '#FFBC76', '#FFD490', '#FFECAA'], category: 'professional', tags: ['education', 'orange', 'energetic'] },

    //Food & Beverage
    { name: 'Coffee Shop', colors: ['#5C4033', '#6F4E37', '#8B7355', '#A0826D', '#C1956B'], category: 'food', tags: ['coffee', 'warm', 'cafe'] },
    { name: 'Candy Store', colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFDAB9'], category: 'food', tags: ['candy', 'sweet', 'playful'] },
    { name: 'Fresh Juice', colors: ['#FF6347', '#FFB347', '#FFFF00', '#90EE90', '#87CEEB'], category: 'food', tags: ['juice', 'fresh', 'fruity'] },
    { name: 'Chocolate & Cream', colors: ['#3B2F2F', '#86608E', '#D4A5A5', '#F0E6E6', '#FFFFFF'], category: 'food', tags: ['chocolate', 'cream', 'dessert'] },
    { name: 'Olive Oil', colors: ['#6B8E23', '#808000', '#A68D5B', '#C0A080', '#E0D5B7'], category: 'food', tags: ['olive', 'mediterranean', 'earthy'] },
    { name: 'Berry Blast', colors: ['#8B0000', '#C2185B', '#D81B60', '#E91E63', '#F06292'], category: 'food', tags: ['berry', 'sweet', 'fruity'] },
    { name: 'Honeycomb', colors: ['#D4A017', '#E8B52E', '#F0C045', '#F8D06A', '#FFE08F'], category: 'food', tags: ['honey', 'golden', 'sweet'] },
    { name: 'Matcha Latte', colors: ['#8CA874', '#A4C27A', '#B8D98C', '#CCF0A0', '#E0FFB4'], category: 'food', tags: ['matcha', 'green', 'calm'] },

    //Gaming & Entertainment
    { name: 'Game Over Red', colors: ['#FF0000', '#CC0000', '#990000', '#660000', '#330000'], category: 'gaming', tags: ['red', 'game', 'intense'] },
    { name: 'Level Up Yellow', colors: ['#FFEB3B', '#FDD835', '#FBC02D', '#F9A825', '#FB8500'], category: 'gaming', tags: ['yellow', 'level up', 'reward'] },
    { name: 'Victory Blue', colors: ['#0066FF', '#0099FF', '#00CCFF', '#00FFFF', '#CCFFFF'], category: 'gaming', tags: ['blue', 'victory', 'win'] },
    { name: 'Adventure Green', colors: ['#00AA00', '#00CC00', '#33FF33', '#66FF66', '#99FF99'], category: 'gaming', tags: ['green', 'adventure', 'nature'] },
    { name: 'Epic Purple', colors: ['#7B00FF', '#9500FF', '#B400FF', '#D000FF', '#FF00FF'], category: 'gaming', tags: ['purple', 'epic', 'legendary'] },
    { name: 'Mario Classic', colors: ['#E52525', '#F8B800', '#48A0D0', '#F0A0A0', '#F8D878'], category: 'gaming', tags: ['mario', 'retro', 'classic'] },
    { name: 'Zelda Gold', colors: ['#B8860B', '#DAA520', '#F0C040', '#FFD700', '#FFE080'], category: 'gaming', tags: ['zelda', 'gold', 'adventure'] },
    { name: 'Minecraft Grass', colors: ['#3C6E3C', '#4C7C4C', '#5C8C5C', '#6C9C6C', '#7CAC7C'], category: 'gaming', tags: ['minecraft', 'blocky', 'nature'] },

    //Romantic & Feminine
    { name: 'Rose Garden', colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1'], category: 'romantic', tags: ['rose', 'romantic', 'pink'] },
    { name: 'Girly Pink', colors: ['#FF69B4', '#FF85C0', '#FFA0D2', '#FFC0E0', '#FFE0F0'], category: 'romantic', tags: ['pink', 'girly', 'soft'] },
    { name: 'Romantic Blush', colors: ['#FFB3BA', '#FFCCCB', '#FFE0E6', '#FFF0F5', '#FFFFFF'], category: 'romantic', tags: ['blush', 'romantic', 'soft'] },
    { name: 'Mauve Silk', colors: ['#CCAACC', '#D4B5D4', '#DCC0DC', '#E8D0E8', '#F0E0F0'], category: 'romantic', tags: ['mauve', 'silk', 'elegant'] },
    { name: 'Dreamy Pink', colors: ['#FF89B4', '#FFB8D1', '#FFC9DB', '#FFD6E8', '#FFE4F0'], category: 'romantic', tags: ['pink', 'dreamy', 'soft'] },
    { name: 'Valentine Red', colors: ['#FF4D4D', '#FF6666', '#FF8080', '#FF9999', '#FFB3B3'], category: 'romantic', tags: ['valentine', 'red', 'love'] },
    { name: 'Wedding White', colors: ['#FFFFFF', '#FFF5F5', '#FFE8E8', '#FFDBDB', '#FFCECE'], category: 'romantic', tags: ['wedding', 'white', 'pure'] },
    { name: 'Cupcake Frosting', colors: ['#FDEBF3', '#FCD5E6', '#FABFD9', '#F8A9CC', '#F693BF'], category: 'romantic', tags: ['cupcake', 'sweet', 'frosting'] },

    //Minimalist & Modern
    { name: 'Stark Contrast', colors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'], category: 'minimal', tags: ['contrast', 'bold', 'modern'] },
    { name: 'Monochrome White', colors: ['#FFFFFF', '#F0F0F0', '#D3D3D3', '#A9A9A9', '#808080'], category: 'minimal', tags: ['white', 'clean', 'minimal'] },
    { name: 'Minimal Black', colors: ['#000000', '#1A1A1A', '#333333', '#666666', '#FFFFFF'], category: 'minimal', tags: ['black', 'minimal', 'sleek'] },
    { name: 'Neutral Beige', colors: ['#D3D3D3', '#C0C0C0', '#A0A0A0', '#696969', '#333333'], category: 'minimal', tags: ['beige', 'neutral', 'calm'] },
    { name: 'Simple Gray', colors: ['#F5F5F5', '#E0E0E0', '#BDBDBD', '#757575', '#212121'], category: 'minimal', tags: ['gray', 'simple', 'clean'] },
    { name: 'Nordic Minimal', colors: ['#F9F9F9', '#E8E8E8', '#D0D0D0', '#A0A0A0', '#606060'], category: 'minimal', tags: ['nordic', 'scandi', 'clean'] },
    { name: 'Brutalist', colors: ['#2C2C2C', '#404040', '#606060', '#808080', '#A0A0A0'], category: 'minimal', tags: ['brutalist', 'raw', 'concrete'] },
    { name: 'Air', colors: ['#F0F4F8', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B'], category: 'minimal', tags: ['airy', 'light', 'clean'] },

    //Seasonal
    { name: 'Spring Fresh', colors: ['#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00'], category: 'seasonal', tags: ['spring', 'fresh', 'green'] },
    { name: 'Summer Heat', colors: ['#FF0000', '#FF6600', '#FFCC00', '#FF3300', '#FF9900'], category: 'seasonal', tags: ['summer', 'heat', 'vibrant'] },
    { name: 'Fall Colors', colors: ['#FF6B35', '#F7931E', '#FDB833', '#C1272D', '#4A1F1A'], category: 'seasonal', tags: ['fall', 'autumn', 'warm'] },
    { name: 'Winter Frost', colors: ['#E0FFFF', '#B0E0E6', '#87CEEB', '#4682B4', '#191970'], category: 'seasonal', tags: ['winter', 'cold', 'ice'] },
    { name: 'Seasonal Blend', colors: ['#FF6B35', '#4682B4', '#228B22', '#FFD700', '#FF1493'], category: 'seasonal', tags: ['seasonal', 'mixed', 'colorful'] },
    { name: 'Halloween Spook', colors: ['#FF6600', '#000000', '#FFA500', '#800080', '#FF4500'], category: 'seasonal', tags: ['halloween', 'spooky', 'orange'] },
    { name: 'Christmas Cheer', colors: ['#D00000', '#00A000', '#FFFFFF', '#FFD700', '#006000'], category: 'seasonal', tags: ['christmas', 'holiday', 'festive'] },
    { name: 'Easter Pastel', colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDAB9'], category: 'seasonal', tags: ['easter', 'pastel', 'spring'] },

    //Cultural & Iconic
    { name: 'Japanese Sakura', colors: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFEAA7'], category: 'cultural', tags: ['japanese', 'sakura', 'cherry blossom'] },
    { name: 'Indian Spice', colors: ['#FF6B35', '#E63946', '#A4161A', '#370617', '#FFBE0B'], category: 'cultural', tags: ['indian', 'spice', 'vibrant'] },
    { name: 'Nordic Design', colors: ['#1C1C1C', '#4A4A4A', '#A9A9A9', '#D3D3D3', '#FFFFFF'], category: 'cultural', tags: ['nordic', 'scandinavian', 'minimal'] },
    { name: 'Mediterranean', colors: ['#FFFFFF', '#0066CC', '#FF6600', '#FFD700', '#32CD32'], category: 'cultural', tags: ['mediterranean', 'coastal', 'warm'] },
    { name: 'Tropical Paradise', colors: ['#FF6B9D', '#FFFF99', '#32CD32', '#00BFFF', '#FF8C00'], category: 'cultural', tags: ['tropical', 'vacation', 'vibrant'] },
    { name: 'African Sunset', colors: ['#FF4D00', '#E68A00', '#CCB300', '#4D9900', '#004D99'], category: 'cultural', tags: ['african', 'sunset', 'warm'] },
    { name: 'Mexican Fiesta', colors: ['#FF1493', '#FF4500', '#FFD700', '#00FF00', '#00BFFF'], category: 'cultural', tags: ['mexican', 'fiesta', 'colorful'] },
    { name: 'Chinese New Year', colors: ['#FF0000', '#FFD700', '#FF8C00', '#8B0000', '#FFB6C1'], category: 'cultural', tags: ['chinese', 'new year', 'festive'] },

    //Accessibility & Inclusive
    { name: 'Colorblind Friendly', colors: ['#000000', '#E69F00', '#56B4E9', '#009E73', '#F0E442'], category: 'accessible', tags: ['colorblind', 'accessible', 'inclusive'] },
    { name: 'High Contrast', colors: ['#000000', '#FFFFFF', '#FFFF00', '#FF0000', '#00FFFF'], category: 'accessible', tags: ['high contrast', 'accessible', 'bold'] },
    { name: 'Readable Palette', colors: ['#1A1A1A', '#404040', '#6E6E6E', '#A8A8A8', '#E8E8E8'], category: 'accessible', tags: ['readable', 'accessible', 'neutral'] },
    { name: 'Soft on Eyes', colors: ['#F5F5F0', '#E8DDD0', '#D4C4B9', '#B29F94', '#8B7D6B'], category: 'accessible', tags: ['soft', 'accessible', 'calm'] },
    { name: 'Accessible Blues', colors: ['#003366', '#0052A3', '#0066CC', '#3399FF', '#66CCFF'], category: 'accessible', tags: ['blue', 'accessible', 'trust'] },
    { name: 'Tritanopia Safe', colors: ['#000000', '#FF6B35', '#FFD700', '#00CED1', '#FFFFFF'], category: 'accessible', tags: ['tritanopia', 'blue-yellow', 'accessible'] },
    { name: 'Protanopia Safe', colors: ['#000000', '#56B4E9', '#009E73', '#E69F00', '#F0E442'], category: 'accessible', tags: ['protanopia', 'red-blind', 'accessible'] },
    { name: 'Deuteranopia Safe', colors: ['#000000', '#56B4E9', '#E69F00', '#009E73', '#CC79A7'], category: 'accessible', tags: ['deuteranopia', 'green-blind', 'accessible'] },

    //Dark Mode Friendly
    { name: 'Dark Mode Blues', colors: ['#0A0E27', '#0F1535', '#142145', '#1A2D55', '#1F3965'], category: 'dark', tags: ['dark mode', 'blue', 'night'] },
    { name: 'Neon Dark', colors: ['#0D0D0D', '#1A1A1A', '#FF0055', '#00FFCC', '#FFCC00'], category: 'dark', tags: ['dark mode', 'neon', 'cyber'] },
    { name: 'Midnight Purple', colors: ['#0B0B1A', '#12122B', '#1A1A3C', '#22224D', '#2A2A5E'], category: 'dark', tags: ['dark mode', 'purple', 'night'] },
    { name: 'Dark Forest', colors: ['#0D1B0D', '#142614', '#1B321B', '#223D22', '#294829'], category: 'dark', tags: ['dark mode', 'green', 'forest'] },
    { name: 'Charcoal Dark', colors: ['#121212', '#1E1E1E', '#2A2A2A', '#363636', '#424242'], category: 'dark', tags: ['dark mode', 'charcoal', 'minimal'] },
    { name: 'Ocean Deep', colors: ['#0A1C2E', '#0E2438', '#122C42', '#16344C', '#1A3C56'], category: 'dark', tags: ['dark mode', 'ocean', 'deep'] },
    { name: 'Dark Rose', colors: ['#1A0D14', '#2A1424', '#3A1B34', '#4A2244', '#5A2954'], category: 'dark', tags: ['dark mode', 'rose', 'romantic'] },
    { name: 'Matrix Dark', colors: ['#0A0A0A', '#0D1F0D', '#0F2A0F', '#123612', '#144114'], category: 'dark', tags: ['dark mode', 'matrix', 'green'] },

    //Trending Colors (Pantone 2024-2025)
    { name: 'Pantone Peach Fuzz', colors: ['#FFB59E', '#FFA38A', '#FF9176', '#FF7F62', '#FF6D4E'], category: 'trending', tags: ['pantone', 'peach', '2024'] },
    { name: 'Digital Lavender', colors: ['#B8A9D9', '#C4B5E0', '#D0C1E7', '#DCCDEE', '#E8D9F5'], category: 'trending', tags: ['lavender', 'digital', '2024'] },
    { name: 'Apricot Crush', colors: ['#FFB08C', '#FFA078', '#FF9064', '#FF8050', '#FF703C'], category: 'trending', tags: ['apricot', 'warm', '2024'] },
    { name: 'Lime Green', colors: ['#B4D900', '#C4E600', '#D4F300', '#E4FF00', '#F0FF33'], category: 'trending', tags: ['lime', 'green', '2024'] },
    { name: 'Radiant Red', colors: ['#FF2400', '#FF3B1A', '#FF5234', '#FF694E', '#FF8068'], category: 'trending', tags: ['red', 'radiant', '2024'] },
    { name: 'Cool Gray', colors: ['#B0B5B9', '#C0C5C9', '#D0D5D9', '#E0E5E9', '#F0F5F9'], category: 'trending', tags: ['gray', 'cool', '2024'] },
    { name: 'Navy Blue', colors: ['#1A2B4C', '#243A5C', '#2E496C', '#38587C', '#42678C'], category: 'trending', tags: ['navy', 'blue', '2024'] },
    { name: 'Warm Earth', colors: ['#A67C52', '#B68C62', '#C69C72', '#D6AC82', '#E6BC92'], category: 'trending', tags: ['earth', 'warm', '2024'] },

    //Famous Artworks
    { name: 'Starry Night', colors: ['#1E3A5F', '#2A4A6F', '#366A8F', '#429ABF', '#5EC8E8'], category: 'art', tags: ['vangogh', 'starry night', 'famous'] },
    { name: 'Mona Lisa', colors: ['#8B7355', '#A0896B', '#B59F81', '#CAB597', '#DFCBAD'], category: 'art', tags: ['da vinci', 'mona lisa', 'classic'] },
    { name: 'Sunflowers', colors: ['#FFD700', '#E8B800', '#D1A000', '#BA8800', '#A37000'], category: 'art', tags: ['vangogh', 'sunflowers', 'yellow'] },
    { name: 'Water Lilies', colors: ['#4A7A6B', '#5A8A7B', '#6A9A8B', '#7AAA9B', '#8ABAAB'], category: 'art', tags: ['monet', 'water lilies', 'impressionist'] },
    { name: 'The Scream', colors: ['#FF6B35', '#E85D2F', '#D14F29', '#BA4123', '#A3331D'], category: 'art', tags: ['munch', 'the scream', 'expressionist'] },
    { name: 'Girl with Pearl Earring', colors: ['#2A4A6F', '#3A5A7F', '#4A6A8F', '#5A7A9F', '#6A8AAF'], category: 'art', tags: ['vermeer', 'pearl', 'classic'] },
    { name: 'Guernica', colors: ['#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080'], category: 'art', tags: ['picasso', 'guernica', 'cubism'] },
    { name: 'The Kiss', colors: ['#D4AF37', '#C4A02E', '#B49126', '#A4821E', '#947316'], category: 'art', tags: ['klimt', 'the kiss', 'gold'] },

    //Movie Scenes
    { name: 'The Matrix', colors: ['#00FF00', '#00E600', '#00CC00', '#00B300', '#009900'], category: 'movie', tags: ['matrix', 'green', 'scifi'] },
    { name: 'Blade Runner 2049', colors: ['#FF6B35', '#FF4500', '#E63946', '#6A4C93', '#2A3B4C'], category: 'movie', tags: ['blade runner', 'cyberpunk', 'neon'] },
    { name: 'Mad Max', colors: ['#D4A574', '#C2956A', '#A87B51', '#8B6341', '#6B4B31'], category: 'movie', tags: ['mad max', 'desert', 'post-apocalyptic'] },
    { name: 'Avatar', colors: ['#00A0B0', '#00B8C0', '#00D0D0', '#00E8E0', '#00FFF0'], category: 'movie', tags: ['avatar', 'blue', 'pandora'] },
    { name: 'Wes Anderson', colors: ['#F4A261', '#E9C46A', '#E76F51', '#2A9D8F', '#264653'], category: 'movie', tags: ['wes anderson', 'pastel', 'quirky'] },
    { name: 'Inception', colors: ['#2C3E50', '#34495E', '#5D6D7E', '#85929E', '#AEB6BF'], category: 'movie', tags: ['inception', 'dream', 'blue'] },
    { name: 'Joker', colors: ['#E63946', '#2A9D8F', '#E9C46A', '#264653', '#6A4C93'], category: 'movie', tags: ['joker', 'gritty', 'colorful'] },
    { name: 'La La Land', colors: ['#E63946', '#F4A261', '#E9C46A', '#2A9D8F', '#264653'], category: 'movie', tags: ['la la land', 'vibrant', 'romantic'] },

    //Popular Games
    { name: 'Super Mario', colors: ['#E52525', '#F8B800', '#48A0D0', '#F0A0A0', '#F8D878'], category: 'game', tags: ['mario', 'nintendo', 'classic'] },
    { name: 'The Legend of Zelda', colors: ['#B8860B', '#DAA520', '#F0C040', '#FFD700', '#FFE080'], category: 'game', tags: ['zelda', 'gold', 'adventure'] },
    { name: 'Minecraft', colors: ['#3C6E3C', '#4C7C4C', '#5C8C5C', '#6C9C6C', '#7CAC7C'], category: 'game', tags: ['minecraft', 'blocky', 'nature'] },
    { name: 'Cyberpunk 2077 Game', colors: ['#FF0055', '#00FFFF', '#FFFF00', '#FF00FF', '#00FF00'], category: 'game', tags: ['cyberpunk', 'neon', 'future'] },
    { name: 'Hollow Knight', colors: ['#2D2D3D', '#3D3D4D', '#4D4D5D', '#5D5D6D', '#6D6D7D'], category: 'game', tags: ['hollow knight', 'dark', 'gothic'] },
    { name: 'Ori', colors: ['#6FD1B0', '#8FE0C0', '#AFF0D0', '#CFFFE0', '#EFFFF0'], category: 'game', tags: ['ori', 'forest', 'magical'] },
    { name: 'Undertale', colors: ['#FFFFFF', '#FFFF00', '#000000', '#FF00FF', '#00FF00'], category: 'game', tags: ['undertale', 'retro', 'colorful'] },
    { name: 'Pokemon', colors: ['#FF0000', '#FFFFFF', '#000000', '#FFD700', '#00BFFF'], category: 'game', tags: ['pokemon', 'anime', 'bright'] }
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

function getPalettesByCategory(category) {
    return paletteLibrary.filter(palette => palette.category === category);
}

function getPalettesByTag(tag) {
    return paletteLibrary.filter(palette => palette.tags.includes(tag));
}

function searchPalettes(query) {
    const lowerQuery = query.toLowerCase();
    return paletteLibrary.filter(palette => 
        palette.name.toLowerCase().includes(lowerQuery) ||
        palette.tags.some(tag => tag.includes(lowerQuery)) ||
        palette.category?.toLowerCase().includes(lowerQuery)
    );
}