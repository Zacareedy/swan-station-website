# DHARMA Swan Station Intranet

An immersive web experience replicating the Swan Station computer terminal from the TV series LOST. This ARG-style website features a functional countdown timer, hidden puzzles, and terminal-based commands.

## Features

### Core Functionality
- **Authentic Terminal Interface**: Command-line interface with the iconic `>: ` prompt
- **Countdown Timer**: 108-minute cycle with color-coded status (green → yellow → red)
- **Sequence Input System**: Enter the correct numbers to reset the timer
- **Hieroglyph Display**: Red and black hieroglyphs appear when timer expires
- **Comprehensive Command System**: Terminal-based navigation and information access

### Commands

**Basic Commands:**
- `help` - Display all available commands
- `status` - Check system status
- `manual` - Display station operations manual
- `logs` - View system logs
- `timer` - Get timer information
- `clear` - Clear terminal screen

**Information Database:**
- `research [FILE]` - Access research documents (ELECTROMAGNETIC, ISLAND, PROTOCOL, TIMETRAVEL)
- `staff` - View redacted personnel directory
- `incident` - Access incident reports
- `about` - Learn about DHARMA Initiative

**Interactive:**
- `input [numbers]` - Input the sequence to reset timer
- `system advanced` - Run advanced diagnostics
- `decode [message]` - Decode ASCII from numbers (e.g., `decode 75-72-71-78` decodes to "URGENT")

**Hidden Easter Eggs:**
- `bird` - Surprise ASCII art
- `the hatch` - Atmospheric message
- `hello world` - Binary greeting
- `song` - Audio file reference
- `morse` - SOS in Morse code
- `apply` - DHARMA recruitment
- `others` - Mysterious message
- `implosion` - System failure simulation

### Timer System

- Starts at 108 minutes (accurate to the show)
- Counts down by 1 minute per system cycle
- Color indicators:
  - **Green**: Operational (> 10 minutes)
  - **Yellow**: Warning (6-10 minutes)
  - **Red**: Critical (< 6 minutes) with pulsing animation
- When timer reaches zero, hieroglyphs automatically appear
- Enter the correct numbers to reset the timer

### Hidden Features

1. **Hieroglyph System**: When the timer expires without input, red and black hieroglyphs appear on the display
2. **Sequence Validation**: The system validates the correct sequence - entering incorrect numbers provides feedback
3. **ARG Elements**: Multiple hidden commands and Easter eggs encourage exploration
4. **Atmospheric Details**: Accurate 1970s DHARMA aesthetic with green text-on-black CRT effect
5. **Scan-line Effects**: Authentic monitor distortion on the hieroglyph overlay

## Gameplay Tips

- Start by typing `help` to see available commands
- Read the `manual` to understand your task
- Check `status` and `timer` regularly
- Explore the `research` database for clues
- The numbers you need are referenced in LOST lore - figure out what they are!
- Experiment with hidden commands - not all Easter eggs are listed
- When the timer expires, have the numbers ready

## Design Inspiration

- Authentic DHARMA Initiative branding
- CRT monitor aesthetic with green phosphor glow
- 1970s computer interface design
- Hierarchical terminal command structure
- ARG puzzle elements throughout

## Technical Details

- Pure HTML, CSS, and JavaScript (no external dependencies)
- Responsive design (works on desktop and mobile)
- Efficient timer system with visual feedback
- Accessible color contrasts while maintaining aesthetic
- Keyboard-accessible terminal interface

## Notes for First-Time Users

This site is intentionally designed to feel like an old, deprecated DHARMA intranet system. Some systems may seem confusing or archaic - that's intentional. Explore the terminal, follow the protocol, and don't forget the numbers.

Remember: **The timer is always counting down.**

---

*DHARMA Initiative - Scientific research for the greater good*