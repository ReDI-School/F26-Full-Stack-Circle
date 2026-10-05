{
  /* this function convert names to first tow letters to 
    be capitals 
    ex John to JN*/
}
import  {AvatarColour} from "./Avatar.types"

export const getInitials = (name: string): string => {
  // Split over any whitespace, one character or more
  const words = name.trim().split(/\s+/);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

{
  /* this functioon determine each name which color belongs to*/
}



export const colourFor = (name: string): AvatarColour => {
  const colours: AvatarColour[] = ['bg-primary', 'bg-secondary', 'bg-tertiary'];

  const index = [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 3;

  return colours[index];
};
