export const isEditable = (level, verifikator, obj) => {
  if (level === 1) return true;
  if (level === obj.level_id && verifikator === 1) return true;
  if (level < obj.level_id) return true;
  return false;
};

export const isMyself = (idAdmin, idUser) => {
  if (idAdmin === idUser) return true;
  return false;
};

export const capitalizeFirstLetter = (words) => {
  var separateWord = words.toLowerCase().split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  let fullWords = separateWord.join(" ");
  let modifiedWord = fullWords.replace("Kab.", "Kabupaten");
  return modifiedWord;
};
