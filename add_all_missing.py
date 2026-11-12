#!/usr/bin/env python3
"""Add all missing content: voices, pricing, FAQ items."""

content = open('c:/Users/user/Downloads/gs/index.html', 'r', encoding='utf-8-sig').read()

print(f"Content length: {len(content)}")

# ============================================================
# 2. ADD MISSING VOICE CARDS
# ============================================================
# Voice cards: CORAL, ALLOY, ASH, BALLAD exist
# Missing: ECHO, SAGE, SHIMMER, VERSE

# Find voice positions in current content
voice_names = ['CORAL', 'ALLOY', 'ASH', 'BALLAD', 'ECHO', 'SAGE', 'SHIMMER', 'VERSE']
voice_positions = {}
for name in voice_names:
    idx = content.find('>' + name + '<')
    if idx >= 0:
        voice_positions[name] = idx
        print(f'{name} at: {idx}')

# Find voice card boundaries
# CORAL card starts before CORAL heading
coral_idx = voice_positions.get('CORAL', -1)
if coral_idx < 0:
    print("ERROR: CORAL not found!")
else:
    # Look backwards from CORAL for the voice card container div
    # Voice cards seem to be wrapped in a div structure
    # Let's find where CORAL's card starts by looking for a div pattern
    
    # Find all </div> patterns before CORAL to understand nesting
    # Actually, let's just find the card by looking at what's between voice headings
    # CORAL at X, ALLOY at Y - the card is from some start before X to some end before Y
    
    alloy_idx = voice_positions.get('ALLOY', -1)
    ash_idx = voice_positions.get('ASH', -1)
    ballad_idx = voice_positions.get('BALLAD', -1)
    
    print(f"\nCORAL: {coral_idx}, ALLOY: {alloy_idx}, ASH: {ash_idx}, BALLAD: {ballad_idx}")
    print(f"Gap CORAL-ALLOY: {alloy_idx - coral_idx}")
    print(f"Gap ALLOY-ASH: {ash_idx - alloy_idx}")
    print(f"Gap ASH-BALLAD: {ballad_idx - ash_idx}")
    
    # Extract CORAL card - from some start before CORAL to ALLOY start
    # Look backwards for the card container
    # Voice cards seem to start with an image div
    search_start = max(0, coral_idx - 3000)
    
    # Find the start of CORAL's card by looking for a div that wraps the card
    # The card seems to have: Image div -> Specialty div -> Body div
    # Let's find where this grouping starts
    
    # Look for the pattern of divs before CORAL
    segment = content[search_start:coral_idx]
    
    # Find all <div tags in this segment
    import re
    div_opens = list(re.finditer(r'<div ', segment))
    div_closes = list(re.finditer(r'</div>', segment))
    
    print(f"\nDiv opens before CORAL: {len(div_opens)}")
    print(f"Div closes before CORAL: {len(div_closes)}")
    
    # The voice card container is likely a div that opens before the image
    # Let's find the last unmatched div open before the image
    # Actually, let's just find where the card div starts by looking for
    # a div with specific classes that appears before each voice card
    
    # From the earlier output, before CORAL we saw:
    # <div class="framer-y2rl4w" data-framer-name="Image" ...>
    # This is the image div, which is inside the card container
    
    # Let's find where the card container starts by looking backwards
    # from the image div for a parent div
    
    # Simpler approach: find the card by looking at what's between
    # the end of the previous section and ALLOY
    
    # CORAL card ends where ALLOY card starts
    # But voice cards might be inside a larger container
    
    # Let's just extract from a reasonable start point to ALLOY's start
    # and use that as the template
    
    # Find a div start before CORAL that could be the card container
    # Look for div with class that doesn't have data-framer-name (container div)
    card_start = None
    for m in reversed(list(re.finditer(r'<div ', segment))):
        div_tag = segment[m.start():segment.find('>', m.start())+1]
        if 'data-framer-name' not in div_tag:
            # This could be a container div
            card_start = search_start + m.start()
            print(f"Possible container div at {card_start}: {div_tag[:100]}")
            break
    
    if card_start:
        card_end = alloy_idx  # End where ALLOY starts
        coral_card = content[card_start:card_end]
        print(f"\nCORAL card: {card_start} to {card_end}, length: {len(coral_card)}")
        print(f"Starts with: {coral_card[:100]}")
        print(f"Ends with: {coral_card[-100:]}")
        
        # Save voice template
        with open('c:/Users/user/Downloads/gs/voice_template.html', 'w', encoding='utf-8-sig') as f:
            f.write(coral_card)
        print("Voice template saved!")