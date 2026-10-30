# Using AI to help with Create Pin component (subpage)

## Main takeaways

- Used ChatGPT to help with non-test coding, especially in Tailwind CSS and some parts React syntax follow this class's AI usage policy.
- AI helped me with Tailwind CSS syntax (with the help of React and Tailwind CSS documents)
- I could not use Map API because it not free and ChatGPT assisted me with a free demo API key (free)
- ChatGPT helped me with the APIProvider from @vis.gl/react-google-maps
- ChatGPT helped me to managing the component states and syntax to interact between them

## Resource Usage

Tool and Model(s) Used: ChatGPT (GPT 6)
Tokens Used & Dollar Equivalent:
Exact token usage and dollar equivalent are not
available through the ChatGPT web interface.

Chat Log
User:
A floating modal would be better, right? Usually, for an interactive experience, when the user wants to do something with a pin, having a modal appear over the page feels more dynamic than navigating to an entirely new page.
Assistant:
I also lean toward a floating modal on top of Google Maps, especially for Campus Pulze, because the map is the center of the experience.
But I want to distinguish one UX point: Create Pin should be a modal, while View Pin should be a popup or floating card. They are different actions.

1. Here is the interaction I propose
   Campus Pulze — Map
   Create Pin
   Interactive Map
   Click Create Pin
   Create Pin
   1
   Basic Info
   2
   Time
   3
   Sharing
   Title
   Description
   Location
   Cancel
   Next →
   Illustration of the Create Pin flow; not a running React interface.
2. Separating the behaviors
   Action Interface
   Click + Create Pin Open a three-step modal
   Click an existing pin Display a short information popup
   Click View Details Open a detail panel
   Click Edit Pin Reopen the modal with pre-filled data
   Select a location on the map Place a temporary marker

The last point is very important: when creating a pin, users should be able to select a location directly on Google Maps instead of being required to enter latitude and longitude. 3. React structure
CreatePinModal would have isOpen and step state, while DefaultPage would be responsible for opening and closing the modal.
Later, we could reuse the modal for Edit Pin instead of writing a second form. 4. First step — a button to open the modal
We do not need to code the entire modal yet. We only need a button to open it on the Home Page.
I suggest placing the floating + Create Pin button in the upper-right corner of the map, below the Navbar, so users can easily find it.
The next step is to add useState to DefaultPage.jsx and then create a simple white modal to verify that opening and closing it works before building the three-step form.
Send me your current DefaultPage.jsx code. I will point out the few lines to add for the button and modal, keeping the Navbar, Sidebar, Google Maps, and working demo pins unchanged.
User:
[Image attachment]
does it display the right phase?
Assistant:
The three-phase progress bar is displaying correctly. Now let's work on Phase 1 — Basic Info, using the two-column layout agreed on with the team.
This time, we will only replace the light-purple content area. Keep the header and three-phase progress bar as they are. We are not implementing Next/Back or connecting to the database yet.
Next step — Two-column layout
Replace the Phase 1 placeholder
Find:
{/_ Temporary phase content _/}

<div className="mt-6 flex min-h-64 items-center justify-center rounded-2xl bg-violet-50">
  <p className="text-violet-600">
    Phase 1 — Basic Info
  </p>
</div>
Replace it with:
{/* Phase 1 — Basic Info */}
<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

{/_ LEFT — Location _/}

  <div className="rounded-2xl bg-[#F8F6FF] p-5">
    <h3 className="mb-3 text-lg font-bold text-[#1f2757]">
      Where is your pin?
    </h3>

    <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-violet-200 bg-white">
      <MapPin className="h-10 w-10 text-violet-500" />
      <p className="text-sm text-slate-500">
        No location selected
      </p>
    </div>

    <label className="mt-5 block text-sm font-semibold text-[#1f2757]">
      Location *
    </label>

    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <Search className="h-5 w-5 text-slate-400" />

      <input
        type="text"
        placeholder="Search or select on map..."
        className="w-full bg-transparent text-sm text-slate-700 outline-none"
      />
    </div>

    <p className="mt-3 text-xs text-slate-400">
      Choose a location in Amherst for your pin.
    </p>

  </div>

{/_ RIGHT — Pin Details _/}

  <div className="flex flex-col gap-5 py-2">
    <div>
      <h3 className="text-lg font-bold text-[#1f2757]">
        What happens here?
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Describe what you want to remember or share.
      </p>
    </div>

    {/* Title */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1f2757]">
        Pin Title <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. CS 311 Study Group"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />
    </div>

    {/* Description */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1f2757]">
        Description
        <span className="ml-2 text-xs font-normal text-slate-400">
          Optional
        </span>
      </label>

      <textarea
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's happening at this location?"
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />
    </div>

  </div>
</div>

{/_ Footer _/}

<div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
  <button
    type="button"
    onClick={onClose}
    className="rounded-xl px-5 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100"
  >
    Cancel
  </button>

<button
type="button"
className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white"

>

    Next
    <ArrowRight className="h-4 w-4" />

  </button>
</div>
I have added the Basic Info, Time, and Sharing UI sections to CreatePin.jsx. I am only working on displaying the UI for now. Is this part okay?
[The user pasted their full CreatePin.jsx source code. Include the original code block from the conversation here unchanged; it has not been reconstructed in this excerpt.]
Assistant:
The overall structure looks okay! But if your goal is to display the UI for all three phases to review before pushing, I see four areas that need adjustment. We will not touch navigation or the backend.
1. Phase 1 is conditionally rendered, but Phases 2 and 3 are not
You wrote:
{currentPhase === 0 && (
  <div>
    {/* Phase 1 */}
  </div>
)}
However, Phases 2 and 3 are still rendered unconditionally.
Because currentPhase = 0 at the moment, the UI will display all three phases at the same time.
If you want to view Phase 1, 2, or 3 individually, we can handle that later. There is no need to add phase navigation logic now.
2. Both radio buttons have defaultChecked
This is the most important issue to fix in Phase 3:
<input
  type="radio"
  name="visibility"
  value="public"
  defaultChecked
/>
You are setting defaultChecked on both Private and Public.
If you want Private to be selected by default, keep defaultChecked only on Private and remove it from Public.
If you have not decided on a default selection, remove it from both.
3. Phase 2 is missing Date
Earlier, you decided that Phase 2 would contain:
- Date
- From Time
- To Time
But the current code has only the two type="time" inputs.
Additionally, the Search or select on map... field is still present from Phase 1 after copying and pasting. If Phase 2 is only for time, you can remove that field.
To create a basic Date input, the syntax is:
<input type="date" />
You can decide where to place it in your existing two-column layout.
4. Three small Tailwind typos
Current code	Correction
text-violin-600	text-violet-600
flex9col	flex-col
rounded-lg-p-2	rounded-lg p-2

Also, index === 0 in the progress bar still highlights Basic Info all the time. That is not a problem if you are building a static UI, but the highlight will not match when viewing Phase 2 or Phase 3.
