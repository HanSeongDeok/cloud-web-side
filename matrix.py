

import os
import random
import time
import sys

def matrix_animation():
    """
    Displays a Matrix-style digital rain animation in the terminal.
    """
    # On Windows, calling 'os.system' with an empty string can help enable
    # ANSI escape sequence processing in older terminals.
    if os.name == 'nt':
        os.system('')

    try:
        width, height = os.get_terminal_size()
    except OSError:
        width, height = 80, 24 # Default size

    # Characters to be used in the digital rain
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    symbols = "!@#$%^&*()_+-=[]{}|;':,.<>/?`~"
    all_chars = chars + symbols

    # 'drops' stores the y-coordinate for each column's falling character
    drops = [1] * width

    try:
        while True:
            # Create the output string for one frame of the animation
            # \033[32m sets the text color to green
            output = "\033[32m"

            for i in range(width):
                text = random.choice(all_chars)
                
                # Move cursor to position (i, drops[i]) and print the character
                # \033[y;xH is the ANSI escape code for moving the cursor
                output += f"\033[{drops[i]};{i}H{text}"

                # If a drop has reached the bottom of the screen,
                # with a small random chance, reset it to the top.
                if drops[i] * 10 > height and random.random() > 0.975:
                    drops[i] = 0
                
                drops[i] += 1
            
            # Print the entire frame at once and flush the output
            sys.stdout.write(output)
            sys.stdout.flush()

            # Control the speed of the animation
            time.sleep(0.05)

    except KeyboardInterrupt:
        # Gracefully exit on Ctrl+C
        print("\n\033[0mAnimation stopped.") # \033[0m resets text formatting

if __name__ == "__main__":
    matrix_animation()

