# trainSchedule

I wanted the the site to look and feel like an olde tyme train arrival/departure board. On the back end I wanted the ability to add trains and remove trains. 


## Getting Started
To add a train fill in the form and click the 'Submit' button or press 'Enter'.
To remove a train/s click the line to highlight it. Once you've clicked all the trains to be deleted click  the 'Clear' button.


### Interesting problems that came up
- deleting trains in firebase
  - I spent a lot of time working out how to retrieve the objects from Firebase. Since each object goes into a randomly generated index name I couldn't just go grab it like I'd done with API calls. I tried any number of things like entering each train under its own file as the train's name but then I had that garbled index number to contend with anyway. The internet provided a lot of lightbulbs that didn't work on my problem until I found a video that walked me through a generic enough version of my problem that I could apply it to my needs.
- iterating the numbers into separate divs
  - I really wanted a retro look and feel so I decided to iterate the times into their own individual divs so that I could style each number individually.


#### Acknowledgments
I'd like to thank the keys on my laptop for having such a satisfying click when I press them
