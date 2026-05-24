// Source of truth for the 23 singles. Reverse chronological.
// Lyric text uses double newlines between stanzas. The build script renders <p> per stanza.
// Cover JPGs live at /public/album-art/singles/<slug>.jpg

export const BRAND_ACCENT = { color: '#1E90FF', rgb: '30,144,255' };

export const COLOR_SERIES_ORDER = [
  { slug: 'black',  emoji: '🖤', label: 'BLACK',  accent: { color: '#9EA0A6', rgb: '158,160,166' } },
  { slug: 'blue',   emoji: '💙', label: 'BLUE',   accent: { color: '#1E90FF', rgb: '30,144,255'  } },
  { slug: 'yellow', emoji: '💛', label: 'YELLOW', accent: { color: '#F5C518', rgb: '245,197,24'  } },
  { slug: 'red',    emoji: '❤️', label: 'RED',    accent: { color: '#E84855', rgb: '232,72,85'   } },
  { slug: 'pink',   emoji: '🩷', label: 'PINK',   accent: { color: '#E91E63', rgb: '233,30,99'   } },
  { slug: 'orange', emoji: '🧡', label: 'ORANGE', accent: { color: '#FF8C42', rgb: '255,140,66'  } },
];

export const SINGLES = [
  {
    slug: 'let-go',
    title: 'Let Go',
    releaseDate: '2026-05-16',
    releaseDisplay: 'May 16, 2026',
    year: 2026,
    spotifyTrackId: '2mzp9QxzUINa3XeVbJ7r00',
    hyperfollowSlug: 'let-go',
    genre: 'Lyrical · EDM · Golden Hour',
    era: 3,
    colorSeries: null,
    emoji: '',
    accent: { color: '#F2C078', rgb: '242,192,120' },
    themes: 'Letting go as becoming — not grief, not triumph, just exhale. The thing you have been carrying, set down.',
    anchorLyric: "But it doesn't matter now — it's time to let go",
    lyrics: `If you only knew
The things I endured
If you only knew
The things I held back
If you only knew
The things I wanna let go of
If you only knew
The things that were out of my control

But it doesn't matter now
It's time to let go

They say
It's time to let go
Be the new self
You truly wanna be

It's now time to let go
To be the version
Everyone needs you to be

Even when you're broken
Even when you don't care
Even when the world
Is the cruel one

Take my hand
Takeover my mind
Because it's time
It's time to let go

I wanna let go
I wanna be
Who the world
Wants me to be
Once I let go`,
  },
  {
    slug: 'pink',
    title: 'PINK',
    releaseDate: '2026-05-04',
    releaseDisplay: 'May 4, 2026',
    year: 2026,
    spotifyTrackId: '5ECSqc5TWS61BjMA0fY9c5',
    hyperfollowSlug: 'pink',
    genre: 'Dark EDM · Rave · Lo-Fi Mashup',
    era: 2,
    colorSeries: 'standalone',
    emoji: '🩷',
    accent: { color: '#E91E63', rgb: '233,30,99' },
    themes: 'Imposed identity, refusal, the cage that looks soft, being seen wrong, the color that doesn’t exist',
    anchorLyric: "Pink is a color that doesn't exist — even in the rainbow",
    lyrics: `Pink is the color I refuse
Pink is a cage
It's not the freedom
They promise you

Pink isn't me
Pink isn't you
Pink is a lie they tell you

Pink is a silo
It's Barbie
When we all know
Pink Barbies aren't real

Pink is the feeling
Of being seen wrong
Pink is assigned
When they think they know you

Pink is a lie
they sell you

It's not in my blood
Not in my bones

Pink was never home
Not mine to own

Pink is assigned
Pink is a lie

Pink is a color
That doesn't exist
Even in the rainbow`,
  },
  {
    slug: 'yellow',
    title: 'YELLOW',
    releaseDate: '2026-04-29',
    releaseDisplay: 'April 29, 2026',
    year: 2026,
    spotifyTrackId: '54dcfCPRxydXRMAVkC5Kv1',
    hyperfollowSlug: 'yellow',
    genre: 'Dark Midtempo EDM · Hypnotic · Seductive',
    era: 2,
    colorSeries: 'member',
    emoji: '💛',
    accent: { color: '#F5C518', rgb: '245,197,24' },
    themes: 'The threshold, the warning ignored, the almost, the color of things too good to last',
    anchorLyric: "Yellow is a light I run past every time",
    lyrics: `Yellow is a sunflower
Chasing the light
Yellow are the solid lines
Guiding me through the road
Yellow is a warning
That I keep driving past

Yellow is the moment
Between stop and go
Yellow is the feeling
Of not wanting to know

Yellow is the color of almost
It's a light
I never slow down for

Yellow is the shining
The sun looks out to
Yellow is close
It is the almost
You never really know
Yellow is the color of things
That are too good to last

Yellow…
Is where I sparkle
Yellow is the color
I chase
Right before I forget

Yellow is a sunflower
Turning toward the light
Yellow is a light
I run past every time`,
  },
  {
    slug: 'run-away',
    title: 'Run Away',
    releaseDate: '2026-03-13',
    releaseDisplay: 'March 13, 2026',
    year: 2026,
    spotifyTrackId: '5FDYzkYvgSGiQp3N6CAT9P',
    hyperfollowSlug: 'run-away',
    genre: 'Lyrical · EDM',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#8C2B3A', rgb: '140,43,58' },
    themes: 'Pre-emptive flight from your own heart, calculated exit before the damage you can already predict',
    anchorLyric: "My heart — it knows my face. All my weaknesses.",
    lyrics: `Do you ever wanna run away?

One day
I'll run away
Because I don't wanna be
Broken again
By my own heart

One day
I'll run away
From my scars
Because I don't wanna be
Broken again
By my own heartaches

One day
I'll run away
Before my chest
Brews up this storm
And my love
Becomes the pain
Because I don't wanna be
broken again
By my own heart

My heart
It knows my face
All my weaknesses
It pulls me out
Then cuts me deep
So I will run away
Before it promises love
That turns into scars

One day
I'll run away
Because I don't wanna be
Broken again
By my own heart

My heart
It knows my face
All my weaknesses
It pulls me out
Then cuts me deep
So I will run away
Before it promises love
That turns into scars

One day
I'll run away
Because I don't wanna be
Broken again
By my own heart`,
  },
  {
    slug: 'drowning',
    title: 'Drowning',
    releaseDate: '2026-02-20',
    releaseDisplay: 'February 20, 2026',
    year: 2026,
    spotifyTrackId: '7l61hwV0dnpmITTRtH1veF',
    hyperfollowSlug: 'drowning',
    genre: 'Lyrical · EDM · Bedroom Pop',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#1B6B7A', rgb: '27,107,122' },
    themes: 'Anxiety and pressure held underwater, smiling while sinking, the gap between who you are and who you thought you’d be',
    anchorLyric: "Smiling while I'm sinking — hoping nobody sees",
    lyrics: `Too loud inside my head
Feels like crossroads
I can't choose wrong
They say don't stress
Like it's that easy
When my whole future
Feels so unsteady

Every time I slow down
start to look around
Like…
How'd I get here now?

I'm drowning
Trying to breathe
But I'm panicking
Smiling
while I'm sinking
Hoping nobody sees

I think about time a lot
Like I'm running out
Did I do enough?
Did I waste it all?

I try to be strong
Try to be steady
But even on good days
I'm not ready

There's this line in my head
How did you get so far
From who you thought
You would be
When you were 17?

I'm drowning
Trying to breathe,
But panicking
I'm drowning
In my thoughts,
Feeling the pressure
Trying to hold it together
But I'm losing my center

Sometimes I close my eyes
Wish it'd all dissolve
Not asking for perfect
Just… something that works

I'm drowning
Like I'm screaming underwater
I'm drowning
But trying to stay afloat
Till I figure it out`,
  },
  {
    slug: 'why-do-we-pretend',
    title: 'Why Do We Pretend?',
    releaseDate: '2026-02-11',
    releaseDisplay: 'February 11, 2026',
    year: 2026,
    spotifyTrackId: '0GGA9PUiM4IuuQ2ZVKnBM6',
    hyperfollowSlug: 'why-do-we-pretend',
    genre: 'Lyrical · Spoken Word · Country / Alt Rock',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#E76A4A', rgb: '231,106,74' },
    themes: 'The performance of being okay, measuring worth in tiny numbers, the exhaustion of pretending, still showing up anyway',
    anchorLyric: "If I stop pretending — will I get what I want?",
    lyrics: `Dear Diary…
Sometimes everything feels… pointless.
Like the world keeps moving
but nothing matters.

Why do we do what we do?
Why do we say what we say?
Do we need proof of being alive?

I catch myself performing.
Smiling on cue.
Typing "I'm good"
With tears streaming down my face

When no one's watching.
When it's just you and your thoughts
Why are you staring at the glow of a screen
That doesn't love you back?

I say "I miss you"
and wonder if I mean it
I say "I'm proud of you"
and hope they hear it

And I hate that I care.
I hate that it matters.
I hate that I measure my worth
in tiny numbers
Invisible to everyone

But
I keep showing up.
typing.
reaching.
hoping my words
isn't just a scream in the void

Dear Diary…
If I stop pretending,
will I get what I want?`,
  },
  {
    slug: 'tick-tock',
    title: 'Tick Tock',
    releaseDate: '2026-02-05',
    releaseDisplay: 'February 5, 2026',
    year: 2026,
    spotifyTrackId: '7jRqOOHLeDrJHRq41EVfwr',
    hyperfollowSlug: 'tick-tock',
    genre: 'EDM · Dark Pop',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#6E859E', rgb: '110,133,158' },
    themes: 'Time anxiety as a physical sensation, the no-exit trap of modern life, the clock that wins whether you slow down or speed up',
    anchorLyric: "How do you escape this maze?",
    lyrics: `The clock is always ticking…
The clock is always ticking
Even when time stands still
Coffee gone cold,
eyes half-living
Chasing dreams
Watching time pass by
Like it's some movie you can't pause

Seconds slip
Plans go wrong
Hope turns thin
Every day feels like it lingers
Till you blink
And it's gone

Tick Tock
Don't let the time stop
Tick Tock
You'll always be on the clock
Tick Tock
You dissolve when time bends
Tick Tock
It's just a phase
Tick Tock
How do you escape this maze?

Neon nights
Morning trains
Same face
Everyone's racing invisible lanes
They smile like they're not afraid
But I see it in their eyes
Counting youth like it's a trade

And the darker side creeps in…
When the days end
Weeks feel out of sync
When you swear you're moving forward
But you're just standing on the brink

What if time is just a trap door?
What if every "someday" you prayed for
Was just a thief?
I feel it pulling at my skin
Like I'm pixels in the rain
If I slow down, I sink within
If I speed up, it's the same

So tell me
Where's the exit?
Where's the loophole?
Where's the break in the chain?

The clock is always ticking…
Tick… tock…
How do you escape this maze?`,
  },
  {
    slug: 'lost-in-the-city',
    title: 'Lost in the City',
    releaseDate: '2026-02-03',
    releaseDisplay: 'February 3, 2026',
    year: 2026,
    spotifyTrackId: '4lL6FEVkHvSpUTzLqPV9OV',
    hyperfollowSlug: 'lost-in-the-city',
    genre: 'Lyrical · Lo-fi',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#E63946', rgb: '230,57,70' },
    themes: 'NYC as identity and home — the one place belonging isn’t a question',
    anchorLyric: "I wear it like skin",
    lyrics: `I get lost
in the city streets
NYC
Gridlines, crosswalk signs
Yellow cabs, sirens breathing
Concrete under my shadows
Park benches
Homework and coffee
Trees whispering
Skyscrapers over my shoulder
9/11
This city's strong
The city is my home

Strangers passing by in a blur
I don't flinch
In all the commotion
I feel aligned

Lost in the city
Middle of the night
Unafraid
Neon lights and sidewalks
My city, my pride
I wear it like skin

NY never backs down
NY never forgets

Lost in the city
Because it's home to me
By the water, seasons change me
Summer heat, and snow
Leaves fall while I watch
People chasing lives
Move fast
Try to get ahead
I'm building mine in moments
They don't even notice yet

I'm lost in the city
Wide awake
Streetlights flicker like
They're rooting for me
Wind in my hair
Time loosens its grip

I've watched my city break
And stand back up again
Taught me how to be strong

Lost in the city
Mesmerized,
In awe
From fire to ice
I've seen it all

My city, my pride
Through change and regret
Never back down
Never forget

Lost in New York
But safe
Lost in New York
Because it's home`,
  },
  {
    slug: 'candy-coated-smile',
    title: 'Candy-Coated Smile',
    releaseDate: '2026-01-28',
    releaseDisplay: 'January 28, 2026',
    year: 2026,
    spotifyTrackId: '3aCnbpJf5A7fV0o1qbyR77',
    hyperfollowSlug: 'candy-coated-smile',
    genre: 'EDM · Dark Pop',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#D63CC5', rgb: '214,60,197' },
    themes: 'The danger hidden inside charm, performing warmth as disguise, duality between what shows and what lives underneath',
    anchorLyric: "Pretty doesn't mean safe — it's just as dangerous",
    lyrics: `A smile is rare
Not everyone knows how
Some are easy
Soft
Unafraid

Some are cracked
Taped together
Through all the pain
A curve of lips
She says I'm fine
Even when
she's not

A smile can heal
Make the heart hum
Warm up your chest
Just enough

Remember
Not every smile
Is safe
Some smiles hide daggers
Pretty
seductive
Dangerous

Candy-coated lips
Lipstick that lies
Cute face
Bad intentions
She smiles
So you don't see
What she's about to do next

Some smiles save you
Without asking
Some dare you closer
Some say
Try me

It's a trap
Sweet sin
Crying
Just because
Laughing
While the world hurts

Pretty
Doesn't mean safe
It's just as dangerous

But the real ones
They make your heart sing
Small
Gentle
Human

With a smile
She says she's still here
Or…
Watch what I do next`,
  },
  {
    slug: 'blue',
    title: 'BLUE',
    releaseDate: '2026-01-24',
    releaseDisplay: 'January 24, 2026',
    year: 2026,
    spotifyTrackId: '17wS11KuQEsL8OuX3evSdS',
    hyperfollowSlug: 'blue',
    genre: 'EDM · Ambient · Dark Pop',
    era: 2,
    colorSeries: 'member',
    emoji: '💙',
    accent: { color: '#D63CC5', rgb: '214,60,197' },
    themes: 'Chosen stillness, grief held in calm, the freeze response as shelter — standing still in the storm by choice',
    anchorLyric: "Calm on the surface — while the world breaks down",
    lyrics: `Blue is the color of ice
It's the color of sky
Blue is ocean waves
The color of storms
Blue is the light that glows
When lightning strikes

Blue is calm
Blue is cold
Blue is the color I walk into
When I wanna…

Blue is the color of storms
That pass without a sound
Calm on the surface
While the world breaks down

Blue is endless
Blue is space
Between the sun and the moon
Blue is mine
Blue is yours
Blue is a bond

It's the sharpness
That cuts through your storms

Blue…
Is where I slow my breath
Blue is the color
I lose myself in
Without fearing what's next

Blue is storms
Blue is cold
Blue is the color I walk into
When I wanna be frozen in time`,
  },
  {
    slug: 'you-in-a-song',
    title: 'You in a Song',
    releaseDate: '2026-01-21',
    releaseDisplay: 'January 21, 2026',
    year: 2026,
    spotifyTrackId: '190TkvRI7szZB75Ut0M2hE',
    hyperfollowSlug: 'you-in-a-song',
    genre: 'Lyrical · Spoken Word · Country / Alt Rock',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#1FA864', rgb: '31,168,100' },
    themes: 'Identity built in real time, the weight of being the strong one, choosing yourself',
    anchorLyric: "I'm not an aesthetic — I'm just a girl who's building and rebuilding in real time",
    lyrics: `I come from a place where expectations are loud
and dreams are supposed to be quiet.
I learned responsibility early
Being the strong one
The giver
The caretaker
I know how to build
But there's a part of me that wants to burn it all down
I don't hate it but...
I'm just scared of becoming trapped inside it

Some days I'm reckless
Other days I'm too careful
Too good
Too controlled

I try to be everything for everyone
I'm hopeful by nature
But I question myself constantly
Am I doing enough?
Am I doing the right things?
Or am I just moving so I don't have to face reality?

I have good days
Bad ones
Worse ones
Then days that remind me why I choose to keep going

I know the struggle is a part of it
Where do I go from here?
I don't fear pain
or silence
I fear lying to myself
Being irrelevant

Forgotten.

I'm not an aesthetic
I'm just a girl who's building
and rebuilding in real time
I love long drives with no destination
Open skies
Oceans that remind me how vast the universe is.

Underneath it all,
I just want peace.

I've been underestimated
Misunderstood
Overlooked
But I'm still here.

Not chasing
I'm Choosing...
ME

And deep down,
I'm just like you.`,
  },
  {
    slug: 'from-the-ashes',
    title: 'From The Ashes',
    releaseDate: '2026-01-18',
    releaseDisplay: 'January 18, 2026',
    year: 2026,
    spotifyTrackId: '0MXn6C6WxVkOVcukj8Er7j',
    hyperfollowSlug: 'from-the-ashes',
    genre: 'Lyrical · EDM · Darkwave',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#E08025', rgb: '224,128,37' },
    themes: 'Rising through fire rather than escaping it, transformation earned not given, turning pain into gold',
    anchorLyric: "I don't escape — I ascend",
    lyrics: `I walked barefoot
White dress torn by the heat
The fire didn't burn me
It taught me how to bend
I felt the flames
I felt the fear
I used it all
To empower

I rise
From the ashes they left behind
Wings of fire
White roses prickling my skin
I don't beg
I don't break
I rediscover myself in the flame

I rise
And I rise

Every scar speaks
Every burn knows my name
I don't wear white for innocence
I wear it to dare the flames

Let it burn
Let it fall
Let it be known
From the ashes
I rise

From the ashes
they left behind
Wings of fire
Embers floating in the sky

I rise

I was reborn
to be.... free

I rise
From the ashes
they left behind
White dress
Fire burning inside
I don't fade,
I don't fold
I turn pain into gold

Look at me now
I don't escape
I ascend
From the ashes
I rise`,
  },
  {
    slug: 'love-is',
    title: 'Love is...',
    releaseDate: '2026-01-17',
    releaseDisplay: 'January 17, 2026',
    year: 2026,
    spotifyTrackId: '5OLYrGYvU8JcEnbbLeWGwZ',
    hyperfollowSlug: 'love-is',
    genre: 'Lyrical · Darkwave · Dark EDM',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#7B3B5A', rgb: '123,59,90' },
    themes: 'Love held as contradiction — warmth and danger, fire and patience simultaneously',
    anchorLyric: "Love is staying — after the high is gone",
    lyrics: `Love is a feeling
An emotion
Of attraction

Love is heat
When the world looks cold
How do you define love?

Love is special
It's the reason you smile
Love is scary

Love is red
Because it's danger
Love is red
Because it's my heart

Love is pressure
When silence gets loud
Love is comfort
That still tells the truth
How do you define love?

Love is fire
That never burns
Love is patience
When leaving would be easier

Love is red
Because it's danger
Love is red
Because it's my heart
Still beating
Even when it's scarred

Love is a choice
Made again and again
Love is a risk
I take anyway
Love is staying
After the high is gone

Love is a feeling
An emotion
Attraction

How do you define love?
Love is…`,
  },
  {
    slug: 'orange',
    title: 'ORANGE',
    releaseDate: '2026-01-15',
    releaseDisplay: 'January 15, 2026',
    year: 2026,
    spotifyTrackId: '2u1IH3gkX6OOq4pMGnA4L9',
    hyperfollowSlug: 'orange',
    genre: 'EDM · Ambient',
    era: 2,
    colorSeries: 'member',
    emoji: '🧡',
    accent: { color: '#FF8C42', rgb: '255,140,66' },
    themes: 'Self-radiance as earned right, warmth that survived everything and still glows',
    anchorLyric: "Orange is where I stand inside — when I let myself glow",
    lyrics: `Orange is warmth
Color of sunset
When days get dark
Color of sunrise
When nights turn to light

Orange is vibrant
It's me when I shine
Orange is peace
Orange is a smile

Orange is the color of warmth
It's a sunset
When days get dark
It's a new sunrise
When nights turn to light

Orange is vibrant
Orange is warmth
It's me when I shine
Orange is radiant
Orange is a smile

Orange…
Is where I feel whole
Orange is the color
I stand inside
When I let myself glow

Orange is peace
It's me when I smile`,
  },
  {
    slug: 'story-of-you',
    title: 'Story of You',
    releaseDate: '2026-01-13',
    releaseDisplay: 'January 13, 2026',
    year: 2026,
    spotifyTrackId: '5ucMIdcMVSivPbzRAFOTZW',
    hyperfollowSlug: 'story-of-you',
    genre: 'Lyrical · Emotional',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#2A4D8F', rgb: '42,77,143' },
    themes: 'The two-voice war — the wound voice that says you’re not enough and the warm voice that knows better',
    anchorLyric: "You're a story only you can write",
    lyrics: `Dear diary,
tonight I confess
There's a shadow in me
I can't suppress
It whispers softly,
It cuts so deep
"Everyone's better, you're nothing to keep"

But in the quiet,
A voice breaks through
Warm and gentle,
It feels like truth

And it says:
You're you
Be proud of you
No one else could ever be you
The way your heart beats,
The way you shine
You're a story only you can write

I try to drown it,
But it still speaks
Tearing me down when I'm feeling weak

And in the silence, I feel it too
The echo rising, pulling me through

It says:
You're you
Be proud of you
No one else could ever do
You're a story only you can write

I try… I try to believe
That the mirror's not my enemy
I try… I try to see
The beauty that's been inside of me

And it says:
You're you
Be proud of you
No one else could ever..
Write the story of you.`,
  },
  {
    slug: 'red',
    title: 'RED',
    releaseDate: '2026-01-12',
    releaseDisplay: 'January 12, 2026',
    year: 2026,
    spotifyTrackId: '1nsT3pA8m6u89QMbfZ4L2v',
    hyperfollowSlug: 'red',
    genre: 'EDM · Dark',
    era: 2,
    colorSeries: 'member',
    emoji: '❤️',
    accent: { color: '#E84855', rgb: '232,72,85' },
    themes: 'Passion that permanently marks the body, love and danger fused into one color',
    anchorLyric: "Red is where I fall in love — red is the color I bleed",
    lyrics: `Red as blood
Red as my pulse
Every truth I never say
Burns just under my skull
Red is the color of love
When it cuts too deep
Red is the color of danger
When your heart won't sleep

Red as fire
Red as sin
Red is the color
That runs underneath my skin

Red is the color of love
When it's begging to stay
Red is the color of danger
When you don't walk away
Crowded with sparks and warnings
And promises said too fast
Red is the color of moments
You know won't last

Red as blood
Red as heat
Red as hunger
Underneath

Red…
Is where I fall in love
Red is the color
I bleed

Red as blood
Red as my pulse
Red... is the love I see`,
  },
  {
    slug: 'escape',
    title: 'ESCAPE',
    releaseDate: '2026-01-11',
    releaseDisplay: 'January 11, 2026',
    year: 2026,
    spotifyTrackId: '56BtuXtta9X8BYVBEH8UXm',
    hyperfollowSlug: 'escape',
    genre: 'EDM · Lyrical · Dark',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#D72638', rgb: '215,38,56' },
    themes: 'Choosing to move rather than run, driving as regulation ritual, carrying your own light',
    anchorLyric: "For the lighthouse I hold within",
    lyrics: `I don't run.
I escape.
Leave the shadows behind
That don't deserve my grace.

The walls don't follow me
once the engine hums.
It's me and the road

I'm Wandering

It's me and the road again
drive until the noise thins,
until the shadows disappear
for the lighthouse I hold within

I feel the fight.
Darkness looses its grip.
Laughter finds me
it's quiet here.

i find peace

I know nothing's fixed
But the road reminds me..
Light still exists

I know now
What I should've known then

Light still exists
And beyond the shadows

I escape`,
  },
  {
    slug: 'dreams-that-run-away',
    title: 'Dreams That Run Away',
    releaseDate: '2026-01-10',
    releaseDisplay: 'January 10, 2026',
    year: 2026,
    spotifyTrackId: '20G7s9waUjuUvQ9eQjIIYy',
    hyperfollowSlug: 'dreams-that-run-away',
    genre: 'Lyrical · Ambient · Darkwave',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#B57AD1', rgb: '181,122,209' },
    themes: 'Chasing something that keeps dissolving, the frustration of almost-grasped hope, still dreaming anyway',
    anchorLyric: "Maybe some things aren't meant to be held — maybe they're just meant to be felt",
    lyrics: `These dreams,
they run away
Like light at the end of yesterday
I chase the echo of their name
But they never stay the same
I reach out in the dark
Try to grab on
Every time I think I'm close
They turn to smoke

Feels like time won't slow down
Every answer fades out

I reach for them
But they slip through my fingers
Just like moments
Distant and fleeting
Here for a second
Gone the next
Tell me was it meant to stay
Or was I meant to keep dreaming?

I replay it in my head
All the words we ever said
I swear I felt it breathe
Like it was choosing me
But the closer that I get
The more it leaves

These dreams,
they run away

I reach for them
But they slip through my fingers
Just like moments
Distant and fleeting
Here for a second
Gone the next
Tell me was it meant to stay
Or was I meant to keep dreaming?

Maybe some things aren't meant to be held
Maybe they're just meant to be felt
If I lose them when I wake
Does that make them a mistake?

These dreams
I reach for them
But they slip through my fingers
Here for a second
Gone the next
Maybe it was never meant to stay
Maybe I was meant to keep dreaming

These dreams…
They run away
But I'm still dreaming anyway.`,
  },
  {
    slug: 'black',
    title: 'BLACK',
    releaseDate: '2026-01-08',
    releaseDisplay: 'January 8, 2026',
    year: 2026,
    spotifyTrackId: '6U69QRtHUmOcFQ1hUEDpYp',
    hyperfollowSlug: 'black-2',
    genre: 'EDM · Dark · Ambient · Darkwave',
    era: 2,
    colorSeries: 'member',
    emoji: '🖤',
    accent: { color: '#9EA0A6', rgb: '158,160,166' },
    themes: 'The interior void as home, voluntary disappearing as self-protection, living with darkness rather than fighting it',
    anchorLyric: "Black is where I made a home",
    lyrics: `Black as night
Black as my soul
No reflection left in the mirror
Just a shape I don't control
Black is the color of darkness
When you've nowhere to go

Black as silence
Black as void
Black is the color
When you have nowhere to go

Black is the color of darkness
Where warmth goes to grow cold
Crowded with ghosts and maybes
And words you've never used

Black as night
Black as my soul
Black as silence
Black as void

Black...
Is where I made a home
Black is the color...
I disappear in
Before I lose control

Black as night
Black as my soul`,
  },
  {
    slug: 'feel-again-pt-2',
    title: 'Feel Again, Pt. 2',
    releaseDate: '2026-01-07',
    releaseDisplay: 'January 7, 2026',
    year: 2026,
    spotifyTrackId: '45HllYwWEtFM4QMZasx7rQ',
    hyperfollowSlug: 'feel-again-pt-2',
    genre: 'Lyrical · Acoustic · Stripped',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#3A7BD5', rgb: '58,123,213' },
    themes: 'Returning to healing with more earned weight, emotional numbness as a survival skill being unlearned',
    anchorLyric: "I'm learning how to feel again",
    lyrics: `Dear Diary,
it's one of those nights
Heart's on mute,
but my mind still fights
Easier to shut it down,
close the door
Numb feels safer
than feeling sore

But there's a whisper in the quiet
Says it's okay to not be silent

I just need someone to lean on
Someone to see me when I'm gone
To feel a hug like morning light
To feel seen,
to feel alright
It doesn't fix the pain inside
But it softens how I breathe tonight
And slowly…
It gets easier to feel again

Sometimes I fake a smile, let it fade
Keep my heart locked behind the shade
But then you sit with me in the dark
No words, just warmth, and that's the spark

And I remember how it felt
Before I taught myself to melt

I just need someone to lean on
Someone to see me when I'm gone
To feel a hug like morning light
To feel seen, to feel alright
It doesn't fix the pain inside
But it softens how I breathe tonight
And slowly…
It gets easier to feel again

It all becomes easy
Not all at once, but then it's breezy
Like laughing through the hurt somehow
Like feeling safe just being now

I just needed someone to lean on
Now I'm not scared of feeling wrong
A smile breaking through the pain
A little light in all this rain
Didn't fix the world outside
But now I hold the sun inside
And slowly…
I feel okay to feel again

Dear Diary…
I'm learning how to feel again`,
  },
  {
    slug: 'monster-no-one-sees',
    title: 'Monster No One Sees',
    releaseDate: '2026-01-07',
    releaseDisplay: 'January 7, 2026',
    year: 2026,
    spotifyTrackId: '5XKWG3ncNtfTEmKXpFdHD9',
    hyperfollowSlug: 'monster-no-one-sees',
    genre: 'Lyrical · Dark · Darkwave',
    era: 2,
    colorSeries: null,
    emoji: '',
    accent: { color: '#C13B3B', rgb: '193,59,59' },
    themes: 'Being the only one who saw what everyone else missed, the isolation of carrying truth nobody wanted',
    anchorLyric: "Haunted. Furious. That I was the only one who knew the monster within.",
    lyrics: `I was asleep
but he wasn't.
Felt his hands through time,
uninvited.

I was in a dream

The school had no doors open,
He walked the halls
But no one saw
The monster within

They laughed with him
while I stared
at teeth behind a smile
claws behind his handshake
the monster behind his mask.

I ran

The gates were locked
a faceless light
pulled me out.

I saw a doll
Plastic. Hollow.

I called for someone.
No answer.
Just the sickening feeling
that no one was coming.
He still lurked the halls
The monster hidden within

I woke up.

haunted.
furious.
that I was the only one
who knew the monster within.`,
  },
  {
    slug: 'the-void',
    title: 'The Void',
    releaseDate: '2026-01-05',
    releaseDisplay: 'January 5, 2026',
    year: 2026,
    spotifyTrackId: '7JunDZR4Mr4vkxmI7ofAZZ',
    hyperfollowSlug: 'the-void',
    genre: 'Lyrical · Ambient · Acoustic',
    era: 1,
    colorSeries: null,
    emoji: '',
    accent: { color: '#D89060', rgb: '216,144,96' },
    themes: 'Not lost, just paused — survival in the in-between, the stillness between past and future as a place you can actually breathe',
    anchorLyric: "I'm not lost — I'm just paused",
    lyrics: `Half of me remembers
what it took to forget
Every scar I learned to hide
every promise I left
I still hear the echoes
of who I used to be
A ghost in the mirror
still looking at me

I carry the weight
of roads I travelled
But my hands still shake
reaching for what's ahead

Half of me leans toward
what hasn't happened yet
The past tugs at my ankles
The future calls my name
And here I am still breathing
in the light in between

I've learned how to stand still
when the world says run
Learned how to keep going
when the damage is done
I don't need the answers
I just need the space
To let tomorrow touch me
at my own pace

I'm not lost
I'm just paused
In a moment that bends

Half of me leans toward
what hasn't happened yet
The past tugs at my ankles
won't loosen its grip, not yet
The future calls my name
through the cracks I'm in
And here I am surviving
in the light between

There's a quiet here
where I finally feel… healed
I don't need to choose
who I used to be
or who I'll become
I can stay right here

In the void
In the light

Half of me remembers
Half of me believes
That I don't have to disappear
to be free
The past can pull
The future can scream
But I'm alive
in the space between

In the light
that exists
in between
the void`,
  },
  {
    slug: 'heart-inside-2',
    title: 'Heart Inside of Me, Pt. 2',
    releaseDate: '2026-01-04',
    releaseDisplay: 'January 4, 2026',
    year: 2026,
    spotifyTrackId: '3mJQtUFLrqZs1erDtF6oeP',
    hyperfollowSlug: 'heart-inside-of-me-pt-2',
    genre: 'Lyrical · Ambient · Darkwave',
    era: 1,
    colorSeries: null,
    emoji: '',
    accent: { color: '#A41E2E', rgb: '164,30,46' },
    themes: 'Armor built from necessity, still showing up even when it doesn’t feel safe',
    anchorLyric: "Still here. Still breathing. Still mine.",
    lyrics: `There's a heart inside of me
That smiles before it cries
Learns how to disappear
Before it ever tries
There's a heart inside of me
That walks before it runs
Plays with fire quietly
Before the damage is done

It learned the shape of silence
Before it learned a voice
Memorized the exits
Before it had a choice

There's a heart inside of me
Still beating through the noise
It memorized pain
Long before it understood joy

There's a heart inside of me
Still counting every breath
It keeps on moving forward
Even when it doesn't feel safe

There's a heart inside of me
That whispers before it sings
Hides in the corners
Of unfinished things
There's a heart inside of me
That learned how not to need
Built walls out of caution
Called it honesty

I learned to brace for impact
Before I learned to fall

There's a heart inside of me
Still beating through the noise
It memorized pain
Long before it understood joy
There's a heart inside of me
Still standing in the mess
It keeps on showing up
Even when it doesn't feel safe

Still here
Still breathing
Still mine`,
  },
  {
    slug: 'fafo',
    title: 'F A F O',
    releaseDate: '2026-01-02',
    releaseDisplay: 'January 2, 2026',
    year: 2026,
    spotifyTrackId: '3Po9q6nVGurb60uOfVSFfi',
    hyperfollowSlug: 'f-a-f-o',
    genre: 'EDM · Lyrical · Alt-Pop',
    era: 1,
    colorSeries: null,
    emoji: '',
    accent: { color: '#D8623A', rgb: '216,98,58' },
    themes: 'Releasing control as an act of agency, walking through fear rather than waiting for it to pass',
    anchorLyric: "The decision is mine. Consequences aren't leaders — they follow.",
    lyrics: `I've got a fear of moving forward
Like every step I take
Might be a mistake
Afraid the choice I make today
Leads me to yesterday
Warnings of heartbreak
I stay aware
Scared of failing loudly
Afraid of getting it wrong... again

They say you miss every shot you don't take
Do you really know what you're missing
If you never try it?

Letting go
Funny how it feels like loss
When it's really just control
Slipping out my fingers
Letting go
Yeah it messes with my head
But I'd rather face the fall
Than live scared instead
So I let go
move forward
I'll figure it out
I will... F A F O

The decision is mine
Consequences aren't leaders
They follow
So I will lead

Letting go
I'm done asking what if
I'll take the risk
And live with it
So I let go
move forward
I'll figure it out
I will... F A F O`,
  },
];

export function singleBySlug(slug) {
  return SINGLES.find((s) => s.slug === slug);
}

export function colorSeriesMembers() {
  return COLOR_SERIES_ORDER.map(({ slug }) => SINGLES.find((s) => s.slug === slug)).filter(Boolean);
}
