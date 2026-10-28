# Using AI to help with My Pin 

## Main takeaways

- Used ChatGPT to help with non-test coding, especially in Tailwind CSS and some parts React syntax follow this class's AI usage policy.
- Helped me with tailoring the css and the home icon -> it disappeared and Chat helped me to make it appear

## Resource Usage

Tool and Model(s) Used: ChatGPT (GPT 6)
Tokens Used & Dollar Equivalent:
Exact token usage and dollar equivalent are not
available through the ChatGPT web interface.

Chat Log
User: [Image]
I found the issue, the two buttons disappeared for different reasons, and each button has its own problem.
Assistant:

1. Home — The button is empty

You currently have:

<button
type="button"
onClick={onHome}

>

</button>

There is no content between <button> and </button>, so neither the Home icon nor the label is visible.

You need to add back the two elements from the original <div>:

<Icon className="h-5 w-5" />
{item.label}

Also, remember to include key={item.label} and the appropriate Tailwind CSS classes.

2. My Pins — The text color is too light

You currently have:

isMyPinOpen
? 'bg-violet-100 text-violet-700'
: 'text-slate-100'

The text-slate-100 color is extremely light against a white background, making the My Pins label and icon appear almost invisible.

Change it to:

: 'text-slate-600'

Additionally, there is an unnecessary double quotation mark (") immediately after font-medium inside the My Pins button's className template literal. Remove that extra quotation mark.

3. Home — The highlighting condition is unreachable

The Home highlighting condition is currently inside the final <div>:

item.label === 'Home' && isMyPinOpen === false
? 'bg-violet-100 text-violet-700'
: 'text-slate-600'

However, when item.label === 'Home', the function already returns the Home button in the earlier if statement.

As a result, JavaScript never reaches the final <div> for the Home item, so the highlighting condition there is never executed for Home.

You need to move the Home highlighting logic into the Home button's own className.

Next step

Let's fix these issues one step at a time.

First, add the icon and {item.label} inside the Home button, and restore its basic Tailwind CSS classes.

After that, we can check the conditional highlighting logic to make sure the correct sidebar item is highlighted when navigating between Home and My Pins.
