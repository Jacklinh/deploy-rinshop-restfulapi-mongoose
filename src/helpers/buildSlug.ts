
import slugify from "slugify";
export const buildSlug= (str: string) => {
    return slugify(str,{
        replacement: '-',// thay thế nối chuỗi các ký tự bằng -
        remove: undefined, // Loại bỏ các ký tự phù hợp với regex, mặc định là `undefined`
        lower: true, // Chuyển đổi thành chữ thường, mặc định là `false`
        strict: false, // Loại bỏ các ký tự đặc biệt, ngoại trừ ký tự thay thế, mặc định là `false` 
        locale: 'vi', // language chuyển đổi
        trim: true
    })
}
const removeVietnameseTones = (str: string): string => {
    const tones: { [key: string]: string } = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'û': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd'
    };

    return str.split('').map(char => tones[char] || char).join('');
};

export const buildSlugImage = (str: string) => {
    const normalizedStr = removeVietnameseTones(str);
    return slugify(normalizedStr,{
        replacement: '-',
        remove: /[^\w\s-]|_/g, 
        lower: true,
        strict: true,
        locale: 'vi', 
        trim: true
    })
}