## Elastic collisions in 2 dimensions and conservation of momentum

This project was originally started by Laurel Woods in Sept/Oct 2017 in Mr Ettlin's advanced animation class at Woodside High School.

But Laurel was not making use of both x and y dimensions so I stepped in and got it working in two dimensions.

The issue is that given the masses and the initial velocities of two bodies in an elastic collision, what are the final velocities for each after the collision.

A good source for understanding the subject is Khan Academy "NCERT Physics Class 11 Unit 6 Lesson 9"

https://www.khanacademy.org/science/in-in-class11th-physics/in-in-class11th-physics-work-energy-and-power/in-in-class11th-physics-work-energy-and-power-elastic-and-inelastic-collisions/v/elastic-and-inelastic-collisions

David SantoPietro in the Khan class derives a short cut which is that the sum of the initial and final velocities of the first object is equal to the sum of the initial and final velocities of the second object.  But that still requires the use of both the conservation of energy and the conservation of momentum formulas to solve for the two unknowns.

An easier and cleaner method uses the center of mass of the two bodies. In the center of mass frame of reference, the velocity of the COM is zero and the initial velocities of the two bodies are adjusted by subtracting the true velocity of the COM.  Then the final velocities of the two bodies in the COM frame of reference are just the negatives or reflections of their initial velocities in the COM frame of reference.  Finally the velocity of the COM is added back to those velocities to arrive at the velocities in the "lab"  frame of reference.

Then there is a short cut derived from that method which finds the final velocities by subtracting the initial velocities from twice the velocity of the COM.

##### v_f = 2 * v_com - v_i

#### Why it works

Let v_i and v_f be the initial and final velocities in the lab frame of reference.

Let u_i and u_f be the initial and final velocities in the COM frame of reference.

Let v_com be the velocity of the COM

In the center-of-mass frame, an elastic collision simply reverses each object’s velocity:

So u_i = v_i - v_com and u_f = - u_i

To transform back to the lab frame:  v_f = -u_i + v_com

Substitute u_i = v_i - v_com

v_f = -(v_i - v_com) + v_com => -v_i + v_com + v_com

v_f = 2 * v_com - v_i

#### 2 dimensions

The short cut formula for finding the final velocity is scalar not vector.  In other words, one dimension.  But the collisions are in two dimensions.  

One might think that two calculations need to be made -- one in the x direction and another in the y direction.

But what if we make the x axis be the line connecting the centers of the two bodies.  Then the components of the velocities that lie on that line are 100% involved in the collision and the components of the velocities that are perpendicular to that line are 0% involved in the collision.

The components of the velocities that are perpendicular still represent momentum that must be conserved.  To conserve those components of the initial momentum, simply add those components to the final velocities as the last step.
