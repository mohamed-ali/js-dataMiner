/*
* Copyright (c), Mohamed Ali Jamaoui, All rights reserved 
* released under the MIT license 
*/


var dm = {}; 

dm.dataMiner = function module(){
	
	function exports(){
		console.log("starting the dataMiner");
	};
	
	
	/* @param{Array}: the data subset, an array of double 
	 * @param{integer}: the number of cluster centroids
	 * @param{integer}: max number of iterations in the algorithm
	 * 
	 *  Note: iteration is a safety key, that is defined by the user to handle the case when the algorithm doesn't converge 
	 *  , I don't know if this case will occur but better be sure than sorry, therefore the algorithm will stop when 
	 *  the max number of iterations is reached (default max 1000)
	 */
	
	exports.kmeans = function(subsets, k, Maxiteration){
		
		
		if(k > subsets.length) {
			return false; 
		}
		
		Array.prototype.diff = function(a) {
		    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
		};
		
		var that = this; //storing the current context, required within callbacks 
		
		//initializing the cluster centroids 
		var centroids = []; 
		for(var i = 0; i<k; i++){centroids.push(subsets[i]);}
		
		//clustering results 
		var clustered = [];
		
		//store the previous centroids 
		var prevCentroid = centroids;
		
		//flag to check if the algorithm converged or not 
		var converged = false; 
		
		//safety condition in case the centroids do not converge 
		var maxIeration = Maxiteration || 1000; //default to 1000
		var iteration = 0; 
		
		while(converged == false){
			
			//cluster assigment step 
			clustered = subsets.map(function(val){
				//Cval : centroid value 
				var result = centroids.map(function(Cval){
					return Math.abs(Cval - val);
				});
				
				//IE 8 and below do not have the Array.prototype.indexOf method
				return result.indexOf(Math.min.apply(Math,result))+1;//detecting the position of the closest cluster centroid 
			});
			
			
			//move cluster step:
			 //split clusters: 
			var splitClusters = []; 
			
			//initialize the array: 
			for(var i = 0; i<k; i++){splitClusters.push([]);}
			
			//splitting the data subsets based on their clusters into an array of arrays 
			clustered.map(function(val, index){
				//the index is the same for the subsets array and the clustered array 
				splitClusters[val-1].push(subsets[index]);
			});
			
			//new centroid values 
		    centroids = splitClusters.map(function(c){
		    	return that.mean(c);
		    });
		    
		    var difference = centroids.diff(prevCentroid);
		    iteration++;
		    
		    if(difference.length == 0 || iteration == maxIeration) converged = true;
		    prevCentroid = centroids;
		}
		
		return clustered;
	};
	
	/*
	* variance test based outlier detection 
	* @param{array}: data subset, an array of doubles 
	* @param{multiplier}: double, the multiplier value for the variance test 
	*/
	
	exports.outlierDetection = function(subset, multiplier){
		
		// handling the case where there is only one element in the data set 
		// you cannot find an outlier in a subset with only one element, can u! 
		var result = [0]; 
		if(subset.length === 1) return result; 
		
		//the mean for the data subset
		var mean = this.mean(subset);
		
		//the variance for the data subset 
		var variance = this.variance(subset);
		
		//the standard deviation for the data subset 
		var std = Math.sqrt(variance);
		
		//upper bound for outlier detection 
		var upper_bound = mean + multiplier * std; 
		
		//lower bound for outlier detection 
		var lower_bound = mean - multiplier * std; 
		
		//outlier detection 
		result =  subset.map(function(d){
			return (lower_bound < d && d <upper_bound) ? 0 : 1;  			
		});
		
		return result; 
	};
	
	//measure the mean of a data subset 
	/*
	* @param{array}: array of doubles
	*/
	// Welford's algorithm.
	exports.mean = function(x) {
		  var n = x.length;
		  if (n === 0) return NaN;
		  var m = 0,
		      i = -1;
		  while (++i < n) m += (x[i] - m) / (i + 1);
		  return m;
	};
	
	//measuer the variance of a given data set 
	/*
	* @param{array}: array of doubles
	*/
	exports.variance = function(x){
		var n = x.length;
		  if (n < 1) return NaN;
		  if (n === 1) return 0;
		  var mean = this.mean(x),
		      i = -1,
		      s = 0;
		  while (++i < n) {
		    var v = x[i] - mean;
		    s += v * v;
		  }
		  return s / (n - 1);
	}; 
	
	return exports; 
	
}; 


//How to use 
//check the documentation here: -- to be added soon.. 
