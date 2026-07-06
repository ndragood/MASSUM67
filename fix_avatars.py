import sys, re

html_file = r'c:\Users\Andra\Documents\3.My Project\MASSUM\index.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

members = [
    ('Andra', 'founder', 'og', 'The Planner'),
    ('Yoel', 'core', 'og', 'The Hype Man'),
    ('Arkan', 'core', 'regular', 'The Listener'),
    ('Janata', 'core', 'og', 'The Driver'),
    ('Arvandra', 'new', 'recruit', 'The New Kid'),
    ('Jirjiz', 'core', 'regular', 'The Foodie'),
    ('Billy', 'founder', 'og', 'The Boss'),
    ('Ilham', 'core', 'regular', 'The Chill One'),
    ('Riko', 'core', 'regular', 'The Comedian'),
    ('Rafi', 'founder', 'og', 'The Hype Man'),
    ('Rafa', 'core', 'regular', 'The Gamer'),
    ('Sam', 'new', 'recruit', 'The Musician'),
    ('Satria', 'core', 'regular', 'The Athlete'),
    ('Khiro', 'core', 'regular', 'The Explorer')
]

cards_html = []
for i, m in enumerate(members):
    name, role, rank, role_lbl = m
    icon = 'star'
    if 'Driver' in role_lbl: icon = 'directions_car'
    elif 'Foodie' in role_lbl: icon = 'restaurant'
    elif 'Gamer' in role_lbl: icon = 'sports_esports'
    elif 'Athlete' in role_lbl: icon = 'sports_basketball'
    elif 'Hype' in role_lbl: icon = 'local_fire_department'
    elif 'Musician' in role_lbl: icon = 'music_note'
    elif 'New Kid' in role_lbl: icon = 'emoji_nature'
    elif 'Explorer' in role_lbl: icon = 'explore'
    elif 'Comedian' in role_lbl: icon = 'sentiment_very_satisfied'
    elif 'Listener' in role_lbl: icon = 'favorite'
    
    rank_lbl = 'OG' if rank == 'og' else ('Recruit' if rank == 'recruit' else 'Regular')
    if role == 'core': rank_lbl += ' / Core Crew'
    elif role == 'founder': rank_lbl += ' / Founder'
    
    avatar = f'./member/{name.lower()}.jpeg'
    
    card = f'''        <div class="organic-card member-card" data-member data-role="{role}" data-rank="{rank}">
          <div class="member-card__image-wrapper">
            <img alt="{name} avatar" src="{avatar}" />
            <div class="member-card__overlay"></div>
            <span class="material-symbols-outlined filled member-card__role-icon">{icon}</span>
          </div>
          <div class="member-card__info">
            <div class="member-card__top">
              <h3 class="member-card__name">{name}</h3>
            </div>
            <div>
              <span class="member-card__rank label-md">{rank_lbl}</span><br />
              <span class="member-card__role body-md">{role_lbl}</span>
            </div>
          </div>
        </div>'''
    cards_html.append(card)

new_grid = '      <div class="roster__grid">\n' + '\n\n'.join(cards_html) + '\n      </div>\n    </div>\n  </main>'

pattern = re.compile(r'<!-- Grid -->.*?</main>', re.DOTALL)
new_content = re.sub(pattern, '<!-- Grid -->\n' + new_grid, content)

new_content = new_content.replace('href="./styles.css?v=7"', 'href="./styles.css?v=8"')

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Cleaned up duplicates and built exact 14 cards with specific avatars.")
