/* eslint-disable */
//const rTabs = (str) => str.trim().replace(/^ {4}/gm, "");

const codes = [
    {
        title: "Hello World",
        filename: "src-1",
        extention: ".c",
        language: "c",
        code: `// Header file for input output functions
#include <stdio.h>

// main function -
// where the execution of program begins
int main()
{
    // prints hello world
    printf("Hello World\\n");

    return 0;
}`,
    },
    {
        title: "Number Input",
        filename: "src-2",
        extention: ".c",
        language: "c",
        code: `// Header file for input output functions
#include <stdio.h>

// main function -
// where the execution of program begins
int main()
{
    int a;
    printf("Enter any number for a: ");
    scanf("%d", &a);
    // prints hello world
    printf("This is second %d\\n", a);

    return 0;
}`,
    },
    {
        title: "For Loop",
        filename: "src-3",
        extention: ".c",
        language: "c",
        code: `#include <stdio.h>

int main()
{
    int sum=0, i;
    for(i=1;i<=5;i++)
    {
        sum=sum+i;
    }
    
    printf("SUM = %d" , sum);
    
    return 0;
}`,
    },
    {
        title: "While Loop",
        filename: "src-4",
        extention: ".c",
        language: "c",
        code: `// Example:

#include<stdio.h>
        
int main()
{
    int no=1, sum=0;

    while(no<=5)
    {
        sum=sum+no;
        no++;
    }
        
    printf("SUM = %d" , sum);

    return 0;
}
        `,
    },
    {
        title: "Open IDE",
        filename: "src-5",
        extention: ".c",
        language: "c",
        code: ``,
    },
];

export default codes;
